import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { changePassword } from "../store/features/userSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "../validations/changePasswordSchema";

const ChangePasswordForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  const onSubmit = async (data: ChangePasswordFormData) => {
    const submissionData = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };
    const resultAction = await dispatch(changePassword(submissionData));
    if (changePassword.fulfilled.match(resultAction)) {
      toast.success("Password updated successfully");
      reset({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ maxWidth: 400, mx: "auto", p: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <h2 className="text-center">Change Password</h2>

      <TextField
        label="Old Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        {...register("oldPassword")}
        error={!!errors.oldPassword}
        helperText={errors.oldPassword?.message as string}
      />
      <TextField
        label="New Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        {...register("newPassword")}
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message as string}
      />
      <TextField
        label="Confirm New Password"
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
          sx={{ py: 1.5 }}
          disabled={loading}
        >
          {loading ? "Processing..." : "Change Password"}
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePasswordForm;
