"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("invalid email format"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .refine(
      (val) => /^\d+$/.test(val),
      "Phone number must contain only digits"
    ),
});

const addressSchema = z.object({
  streetAddress: z.string().min(1, "street address is required"),
  city: z.string().min(1, "city is required"),
  zipCode: z
    .string()
    .min(5, "zip code must be at least 5 digits")
    .refine((val) => /^\d+$/.test(val), "zip code must contain only numbers"),
});

const accountSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(6, "password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "please confirm your password"),
});

//combined schema for the entire form

const formSchema = z
  .object({
    ...personalInfoSchema.shape,
    ...addressSchema.shape,
    ...accountSchema.shape,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const MultiStep = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      streetAddress: "",
      city: "",
      zipCode: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const nextStep = async () => {
    let fieldsToValidate = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["fullName", "email", "phoneNumber"];
        break;
      case 2:
        fieldsToValidate = ["streetAddress", "city", "zipCode"];
        break;
      case 3:
        fieldsToValidate = ["username", "password", "confirmPassword"];
        break;
      default:
        break;
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = (data) => {
    setFormData(data);
    // console.log(data);
    // const formData = getValues();
    console.log("form submitting with data", data);
    console.log(formData);
    setSubmitted(true);
    setShowSummary(false);
  };

  const handleFinalSubmit = async () => {
    // Validate the account fields first
    const isValid = await trigger(["username", "password", "confirmPassword"]);

    if (isValid) {
      const currentValues = getValues();
      setFormData((prevData) => ({
        ...prevData,
        ...currentValues,
      }));

      setShowSummary(true);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Step 1: Personal Information</h2>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="fullName"
              >
                Full Name *
              </label>
              <input
                id="fullName"
                {...register("fullName")}
                className={`w-full p-2 border rounded ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`w-full p-2 border rounded ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="phoneNumber"
              >
                Phone Number *
              </label>
              <input
                id="phoneNumber"
                {...register("phoneNumber")}
                className={`w-full p-2 border rounded ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="At least 10 digits"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Step 2: Address Details</h2>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="streetAddress"
              >
                Street Address *
              </label>
              <input
                id="streetAddress"
                {...register("streetAddress")}
                className={`w-full p-2 border rounded ${
                  errors.streetAddress ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.streetAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.streetAddress.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="city">
                City *
              </label>
              <input
                id="city"
                {...register("city")}
                className={`w-full p-2 border rounded ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="zipCode"
              >
                Zip Code *
              </label>
              <input
                id="zipCode"
                {...register("zipCode")}
                className={`w-full p-2 border rounded ${
                  errors.zipCode ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="At least 5 digits"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.zipCode.message}
                </p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Step 3: Account Setup</h2>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="username"
              >
                Username *
              </label>
              <input
                id="username"
                {...register("username")}
                className={`w-full p-2 border rounded ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Minimum 4 characters"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password *
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`w-full p-2 border rounded ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Minimum 6 characters"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="confirmPassword"
              >
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={`w-full p-2 border rounded ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Must match password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Summary component
  const renderSummary = () => {
    const data = getValues();
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Review Your Information</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              Personal Information
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <p className="font-medium">Full Name:</p>
              <p className="col-span-2">{data.fullName}</p>

              <p className="font-medium">Email:</p>
              <p className="col-span-2">{data.email}</p>

              <p className="font-medium">Phone:</p>
              <p className="col-span-2">{data.phoneNumber}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              Address Details
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <p className="font-medium">Street:</p>
              <p className="col-span-2">{data.streetAddress}</p>

              <p className="font-medium">City:</p>
              <p className="col-span-2">{data.city}</p>

              <p className="font-medium">Zip Code:</p>
              <p className="col-span-2">{data.zipCode}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 border-b pb-1">
              Account Information
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <p className="font-medium">Username:</p>
              <p className="col-span-2">{data.username}</p>

              <p className="font-medium">Password:</p>
              <p className="col-span-2">{data.password}</p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setShowSummary(false)}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Edit Information
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Confirm & Submit
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            Form Submitted Successfully!
          </h2>
          <p className="mb-4">Thank you for your submission.</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(1);
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-30">
        Please fill up the Information
      </h1>

      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step
                      ? "bg-blue-500 text-white"
                      : currentStep > step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {currentStep > step ? "✓" : step}
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 w-16 ${
                      currentStep > step ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}

          <div className="mt-6 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                type="button"
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ml-auto"
              >
                Submit
              </button>
            )}
          </div>
        </form>
        {showSummary && renderSummary()}
      </div>
    </div>
  );
};

export default MultiStep;
