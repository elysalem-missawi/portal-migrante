type SmsResult = {
  sent: boolean;
  skipped?: boolean;
  reason?: string;
};

function getTwilioConfig() {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromNumber: process.env.TWILIO_FROM_NUMBER,
    verifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
  };
}

export function isTwilioConfigured(): boolean {
  const config = getTwilioConfig();
  return Boolean(
    config.accountSid &&
      config.authToken &&
      (config.fromNumber || config.verifyServiceSid)
  );
}

export function isTwilioVerifyConfigured(): boolean {
  const config = getTwilioConfig();
  return Boolean(config.accountSid && config.authToken && config.verifyServiceSid);
}

function authHeader(accountSid: string, authToken: string): string {
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`;
}

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const { accountSid, authToken, fromNumber } = getTwilioConfig();

  if (!accountSid || !authToken || !fromNumber) {
    return {
      sent: false,
      skipped: true,
      reason: "twilio_not_configured",
    };
  }

  const params = new URLSearchParams({
    To: to,
    From: fromNumber,
    Body: body,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: authHeader(accountSid, authToken),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Twilio SMS failed (${response.status})`);
  }

  return { sent: true };
}

export async function startPhoneVerification(to: string): Promise<SmsResult> {
  const { accountSid, authToken, verifyServiceSid } = getTwilioConfig();

  if (!accountSid || !authToken || !verifyServiceSid) {
    return {
      sent: false,
      skipped: true,
      reason: "twilio_verify_not_configured",
    };
  }

  const params = new URLSearchParams({
    To: to,
    Channel: "sms",
  });

  const response = await fetch(
    `https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`,
    {
      method: "POST",
      headers: {
        Authorization: authHeader(accountSid, authToken),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Twilio Verify failed (${response.status})`);
  }

  return { sent: true };
}

export async function checkPhoneVerification(
  to: string,
  code: string
): Promise<{ approved: boolean; status?: string }> {
  const { accountSid, authToken, verifyServiceSid } = getTwilioConfig();

  if (!accountSid || !authToken || !verifyServiceSid) {
    return { approved: false, status: "twilio_verify_not_configured" };
  }

  const params = new URLSearchParams({
    To: to,
    Code: code,
  });

  const response = await fetch(
    `https://verify.twilio.com/v2/Services/${verifyServiceSid}/VerificationCheck`,
    {
      method: "POST",
      headers: {
        Authorization: authHeader(accountSid, authToken),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Twilio verification check failed (${response.status})`);
  }

  const result = (await response.json()) as { status?: string };
  return {
    approved: result.status === "approved",
    status: result.status,
  };
}
