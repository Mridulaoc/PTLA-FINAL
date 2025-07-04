import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyOTP } from "../store/features/userSlice";

import { AppDispatch, RootState } from "../store/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { resendOtp } from "../store/features/otpSlice";

export const VerifyOTP = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState<number>(60);
  const [otpInvalid, setOtpInvalid] = useState<boolean>(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) toast.error("Cannot eneter except numbers");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      toast.error("Please enter the complete OTP");
      return;
    }
    if (userId) {
      try {
        const resultAction = await dispatch(
          verifyOTP({ userId, otp: enteredOtp })
        );
        if (verifyOTP.fulfilled.match(resultAction)) {
          toast.success("OTP verified successfully!");
          navigate(`/reset-password/${userId}`);
        } else if (verifyOTP.rejected.match(resultAction)) {
          setOtpInvalid(true);
          toast.error(resultAction.payload?.message || "Invalid OTP");
        }
      } catch (error) {
        if (typeof error === "string") {
          toast.error(error);
        }
      }
    }
  };

  const handleResend = () => {
    if (userId) {
      dispatch(resendOtp({ userId }));
      setTimer(60);
      setOtp(["", "", "", ""]);
      setOtpInvalid(false);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: "1rem",
        textAlign: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Verify OTP
      </Typography>

      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        {otp.map((digit, index) => (
          <TextField
            key={index}
            id={`otp-${index}`}
            type="text"
            variant="outlined"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            inputRef={(el) => (inputRefs.current[index] = el)}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "1rem",
                width: "2rem",
                height: "2rem",
              },
            }}
          />
        ))}
      </Box>

      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleVerify}
          disabled={loading || timer === 0}
          sx={{ width: "100%" }}
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>

        {timer === 0 ? (
          <Button variant="text" color="secondary" onClick={handleResend}>
            Resend OTP
          </Button>
        ) : otpInvalid && timer > 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
          >
            <Typography variant="body1" color="textSecondary">
              Time remaining: {timer}s
            </Typography>
            <Button variant="text" color="secondary" onClick={handleResend}>
              Resend OTP
            </Button>
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Time remaining: {timer}s
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
