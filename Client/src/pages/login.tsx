import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin } from "../store/features/userSlice";
import { AppDispatch, RootState } from "../store/store";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { LoginFormInputs, loginSchema } from "../validations/loginSchema";

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      const returnTo = searchParams.get("returnTo") || "/dashboard";
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const actionResult = await dispatch(loginUser(data));

      if (loginUser.fulfilled.match(actionResult)) {
        toast.success("Login successful!");
        const returnTo = searchParams.get("returnTo") || "/";
        navigate(returnTo);
      } else {
        const errorMessage = actionResult.payload?.message || "Login failed";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred while logging in.");
    }
  };
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    throw new Error(
      "Google Client ID is missing in the environment variables."
    );
  }
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      try {
        const result = await dispatch(googleLogin(response.credential));
        if (googleLogin.fulfilled.match(result)) {
          toast.success("Google login successful!");
          const returnTo = searchParams.get("returnTo") || "/";
          navigate(returnTo);
        } else {
          const errorMessage =
            result.payload?.message || "Failed to login with Google";
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Failed to login with Google");
      }
    } else {
      console.error("No credential received from Google");
      toast.error("No credential received from Google");
    }
  };

  const handleGoogleFailure = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ maxWidth: 400, mx: "auto", p: 3, boxShadow: 1, mt: 3 }}
    >
      <Typography variant="h5" mb={2} sx={{ textAlign: "center" }}>
        Login
      </Typography>

      <Controller
        name="email"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            required
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            required
          />
        )}
      />
      <NavLink to="/forgot-password">
        <Typography>
          <p className="text-center underline">Forgot Password?</p>
        </Typography>
      </NavLink>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
      </Button>
      <Typography>
        <p className="my-5 text-center">
          Don't have an account?{" "}
          <NavLink to="/register">
            <span className="underline px-5">Register Now</span>
          </NavLink>
        </p>
      </Typography>

      <div className="w-full flex justify-center mt-3">
        <GoogleOAuthProvider clientId={googleClientId}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            width="100%"
            size="large"
          />
        </GoogleOAuthProvider>
      </div>
    </Box>
  );
};

export default Login;
