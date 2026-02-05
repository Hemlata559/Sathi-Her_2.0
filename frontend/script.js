let savedPhone = "";

async function sendOTP() {
    savedPhone = document.getElementById("phone").value;

    const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: savedPhone })
    });

    const data = await res.json();
    alert(data.message || "OTP Sent");

    document.getElementById("phoneBox").style.display = "none";
    document.getElementById("otpBox").style.display = "block";
}

async function verifyOTP() {
    const otp = document.getElementById("otp").value;

    const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            phone: savedPhone,
            otp: otp
        })
    });

    const data = await res.json();
    alert(data.message);
}