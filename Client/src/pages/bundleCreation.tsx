import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  addCourseToBundle,
  createBundle,
  fetchAllCourses,
  removeCourseFromBundle,
  resetBundleCourses,
} from "../store/features/courseBundleSlice";
import { useSelector } from "react-redux";
import { DeleteIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { compressImage, convertToFile } from "../utils/imageCompression";
import { toast } from "react-toastify";
import { uploadFeaturedImage } from "../store/features/courseSlice";
import { ICreateBundleFormData } from "../Types/courseBundleTypes";
import { BundleFormValues, bundleSchema } from "../validations/bundleSchema";

const BundleCreation = () => {
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { courses, currentBundle } = useSelector(
    (state: RootState) => state.bundle
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchAllCourses());
    }
  }, [dispatch, courses.length]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    register,
  } = useForm<BundleFormValues>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      title: "",
      description: "",
      discountedPrice: 0,
      featuredImage: "",
      accessType: "lifetime",
      accessPeriodDays: null,
    },
  });
  const featuredImage = watch("featuredImage");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      try {
        const result = await compressImage(file);
        const compressedFile = await convertToFile(
          result.compressedImage,
          file.name
        );
        setFeaturedImageFile(compressedFile);
        setValue("featuredImage", result.compressedImage);
      } catch (error) {
        console.log(error);
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setValue("featuredImage", reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCourseSelect = (event: SelectChangeEvent<string>) => {
    const courseId = event.target.value as string;
    setSelectedCourseId(courseId);
    if (courseId) {
      const selectedCourse = courses.find((course) => course._id === courseId);
      if (selectedCourse) {
        dispatch(addCourseToBundle(selectedCourse));
      }
    }
  };

  const handleRemoveCourse = (courseId: string) => {
    dispatch(removeCourseFromBundle(courseId));
  };

  const validateDiscountedPrice = () => {
    if (!currentBundle) return true;
    return currentBundle.discountedPrice! < currentBundle.totalPrice!;
  };

  const validateAccessPeriod = () => {
    const accessType = watch("accessType");
    const accessPeriodDays = watch("accessPeriodDays");

    if (
      accessType === "limited" &&
      (!accessPeriodDays || accessPeriodDays <= 0)
    ) {
      return false;
    }
    return true;
  };

  const onSubmit = async (data: BundleFormValues) => {
    setIsUploading(true);
    if (!featuredImageFile) {
      toast.error("Please uplaod featuredImage");
      return;
    }

    if (!currentBundle?.courses || currentBundle.courses.length === 0) {
      toast.error("Please add at least one course to the bundle");
      setIsUploading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("featuredImage", featuredImageFile);
      const uploadResponse = await dispatch(
        uploadFeaturedImage(formData)
      ).unwrap();

      const featuredImageUrl =
        typeof uploadResponse === "string"
          ? uploadResponse
          : uploadResponse.url;

      const totalPrice = currentBundle.courses.reduce(
        (total, course) => total + course.price,
        0
      );
      const bundleData: ICreateBundleFormData = {
        ...data,
        featuredImage: featuredImageUrl,
        totalPrice,
        courses: currentBundle?.courses!.map((course) => course._id),
        accessPeriodDays:
          data.accessType === "lifetime" ? null : data.accessPeriodDays,
      };

      await dispatch(createBundle(bundleData)).unwrap();
      reset();
      dispatch(resetBundleCourses());
      toast.success("Bundle created successfully");
      navigate("/admin/dashboard/bundles");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      toast.error("Error creating bundle");
    }
  };
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create Course Bundle
        </Typography>
        <Paper elevation={3}>
          <Box p={3} component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Bundle Details
                </Typography>

                <TextField
                  fullWidth
                  label="Bundle Title"
                  {...register("title")}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  sx={{ mb: 2 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Box mt={2}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="featuredImage-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="featuredImage-upload">
                    <Button variant="outlined" component="span">
                      Upload Featured Image
                    </Button>
                  </label>
                  {errors.featuredImage && (
                    <FormHelperText error>
                      {errors.featuredImage.message}
                    </FormHelperText>
                  )}
                  {featuredImage && (
                    <Box mt={2} sx={{ maxWidth: 300 }}>
                      <img
                        src={featuredImage}
                        alt="Featured Preview"
                        style={{ width: "100%", borderRadius: 4 }}
                      />
                    </Box>
                  )}
                </Box>
                <Box mt={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Total Price"
                        value={currentBundle?.totalPrice?.toFixed(2) || 0}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Discounted Price"
                        type="number"
                        InputProps={{
                          inputProps: { min: 0 },
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                        {...register("discountedPrice", {
                          valueAsNumber: true,
                        })}
                        error={
                          !!errors.discountedPrice || !validateDiscountedPrice()
                        }
                        helperText={
                          errors.discountedPrice?.message ||
                          (!validateDiscountedPrice() &&
                            "Discounted price must be less than total price")
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="access-type-label">Access Type</InputLabel>
                  <Select
                    labelId="access-type-label"
                    label="Access Type"
                    {...register("accessType")}
                    error={!!errors.accessType}
                  >
                    <MenuItem value="lifetime">Lifetime</MenuItem>
                    <MenuItem value="limited">Limited Time</MenuItem>
                  </Select>
                  {errors.accessType && (
                    <FormHelperText error>
                      {errors.accessType.message}
                    </FormHelperText>
                  )}
                </FormControl>
                {watch("accessType") === "limited" && (
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Access Period (days)"
                    type="number"
                    InputProps={{
                      inputProps: { min: 1 },
                    }}
                    {...register("accessPeriodDays", {
                      valueAsNumber: true,
                    })}
                    error={!!errors.accessPeriodDays}
                    helperText={errors.accessPeriodDays?.message}
                  />
                )}
                <Typography variant="h6" gutterBottom>
                  Select Courses
                </Typography>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="course-select-label">Add Course</InputLabel>
                  <Select
                    labelId="course-select-label"
                    label="Add Course"
                    value={selectedCourseId}
                    onChange={handleCourseSelect}
                  >
                    <MenuItem value="">
                      <em>Select a course</em>
                    </MenuItem>
                    {courses.map((course) => (
                      <MenuItem
                        key={course._id}
                        value={course._id}
                        disabled={currentBundle?.courses!.some(
                          (c) => c._id === course._id
                        )}
                      >
                        {course.title} - ₹{course.price.toFixed(2)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Selected Courses({currentBundle?.courses!.length || 0})
                  </Typography>
                  {!currentBundle?.courses!.length && (
                    <Typography variant="body2" color="textSecondary">
                      No courses selected yet. Please select at least one course
                    </Typography>
                  )}
                  {currentBundle?.courses!.map((course) => (
                    <Card key={course._id} sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex" }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 100 }}
                          image={
                            course.featuredImage ||
                            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                          }
                          alt={course.title}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          <CardContent sx={{ flex: "1 0 auto", py: 1 }}>
                            <Typography component="div" variant="subtitle1">
                              {course.title}
                            </Typography>
                            <Typography variant="body2" color="primary">
                              ₹{course.price.toFixed(2)}
                            </Typography>
                          </CardContent>
                        </Box>

                        <CardActions
                          disableSpacing
                          sx={{ justifyContent: "flex-end", p: 1 }}
                        >
                          <IconButton
                            aria-label="remove course"
                            onClick={() => handleRemoveCourse(course._id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </CardActions>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={
                      isUploading ||
                      !currentBundle?.courses?.length ||
                      !validateDiscountedPrice() ||
                      !validateAccessPeriod()
                    }
                  >
                    {isUploading ? "Creating..." : "Create Bundle"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BundleCreation;
