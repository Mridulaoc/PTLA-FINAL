import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextField, Button, CircularProgress, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { registerUser } from "../store/features/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { schema, SignupFormData } from "../validations/signupSchema";

export type FormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

const SignupForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, successMessage, userId } = useSelector(
    (state: RootState) => state.user
  );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignupFormData) => {
    const submissionData: FormData = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      password: data.password,
    };
    dispatch(registerUser(submissionData)).unwrap();
  };

  useEffect(() => {
    if (successMessage && userId) {
      toast.success(successMessage);
      navigate(`/otp/${userId}`);
    }
    if (error) {
      toast.error(error);
    }
  }, [successMessage, error]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ maxWidth: 400, mx: "auto", p: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <h2 className="text-center">Sign Up</h2>

      <TextField
        label="First Name"
        variant="outlined"
        fullWidth
        margin="normal"
        {...register("firstName")}
        error={!!errors.firstName}
        helperText={errors.firstName?.message as string}
      />
      <TextField
        label="Last Name"
        variant="outlined"
        fullWidth
        margin="normal"
        {...register("lastName")}
        error={!!errors.lastName}
        helperText={errors.lastName?.message as string}
      />
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        {...register("username")}
        error={!!errors.username}
        helperText={errors.username?.message as string}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message as string}
      />
      <TextField
        label="Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message as string}
      />
      <TextField
        label="Confirm Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message as string}
      />
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Register"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default SignupForm;
