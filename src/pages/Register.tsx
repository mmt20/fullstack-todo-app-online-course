import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, SubmitHandler } from "react-hook-form";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { REGISTER_FORM } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation";
import axIosinstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(registerSchema) });

  // ** Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    //  1- Pending   => Loading
    setIsLoading(true);
    try {
      //  2- Fulfilled => SUCCESS => (OPTIONAL)
      const { status } = await axIosinstance.post("/auth/local/register", data);
      console.log(status);

      if (status === 200) {
        toast.success(
          "You will navigate to the page after 4 seconds to login!",
          {
            position: "bottom-center",
            duration: 4000,
            style: {
              backgroundColor: "black",
              color: "White",
              width: "fit-content",
            },
          }
        );
      }
    } catch (error) {
      // **  3- Rejected  => Field   => (OPTIONAL)
      const errObj = error as AxiosError<IErrorResponse>;
      console.log(errObj.response?.data.error.message);
      toast.error(`${errObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ** Renders
  const renderRegisterForm = REGISTER_FORM.map(
    ({ name, placeholder, type, validation }, idx) => {
      return (
        <div key={idx}>
          <Input
            type={type}
            placeholder={placeholder}
            {...register(name, validation)}
          />
          {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
        </div>
      );
    }
  );

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Register to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterForm}
        {/* Submit Button */}
        <Button isLoading={isLoading} fullWidth>
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
