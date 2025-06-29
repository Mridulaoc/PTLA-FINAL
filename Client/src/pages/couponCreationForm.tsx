import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AppDispatch } from "../store/store";
import { createCoupon } from "../store/features/couponSlice";
import { toast } from "react-toastify";
import { CouponFormValues, couponSchema } from "../validations/couponSchema";

const CouponCreationForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: 0,
      expiryDate: "",
    },
  });

  const discountType = watch("discountType");

  const onSubmit = async (data: CouponFormValues) => {
    try {
      const expiryDate = new Date(data.expiryDate);
      const result = await dispatch(
        createCoupon({
          ...data,
          expiryDate,
        })
      );
      if (createCoupon.fulfilled.match(result)) {
        const successMessage =
          result.payload?.message || "Coupon added successfully";
        toast.success(successMessage);
        reset();
      } else if (createCoupon.rejected.match(result)) {
        const errorMessage = result.payload?.message || "Adding coupon failed";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Failed to create coupon:", error);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Create New Coupon"
        subheader="Add a new discount coupon to your store"
      />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Coupon Code"
                    fullWidth
                    error={!!errors.code}
                    helperText={errors.code?.message}
                    placeholder="e.g. WORKSHOP101"
                    inputProps={{ style: { textTransform: "uppercase" } }}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="discountType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.discountType}>
                    <InputLabel id="discount-type-label">
                      Discount Type
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="discount-type-label"
                      label="Discount Type"
                    >
                      <MenuItem value="percentage">Percentage (%)</MenuItem>
                      <MenuItem value="fixed">Fixed Amount</MenuItem>
                    </Select>
                    {errors.discountType && (
                      <FormHelperText>
                        {errors.discountType.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="discountValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Discount Value"
                    type="number"
                    fullWidth
                    error={!!errors.discountValue}
                    helperText={errors.discountValue?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {discountType === "fixed" ? "₹" : ""}
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {discountType === "percentage" ? "%" : ""}
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expiry Date"
                    type="date"
                    fullWidth
                    error={!!errors.expiryDate}
                    helperText={errors.expiryDate?.message}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  Create Coupon
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CouponCreationForm;
