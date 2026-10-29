import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from 'zod'
import { loginUser } from '../services/auth.service';
import { setAccessToken } from '../slices/auth.slice';

const loginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(4, "Password length should be min 3 character ")
})

type LoginFormData = z.infer<typeof loginSchema>;


const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {register, handleSubmit, formState:{errors}} = useForm<LoginFormData>({resolver: zodResolver(loginSchema)})


    const onSubmit = async(data: LoginFormData) => {
        const response = await loginUser(data);
        dispatch(setAccessToken(response.data.accessToken))

        navigate('/dashboard')
    }


  return (
     <div className="flex min-h-screen items-center justify-center ">
      <form
       onSubmit={handleSubmit(onSubmit)}
       className='w-full max-w-md space-y-4 rounded-lg border p-6 '
       >
        <h1 className='text-3xl font-bold text-center'>Login</h1>

        <div>
          <input
           type="email" 
           placeholder='Email'  
           {...register("email")}
           className='w-full border p-2 rounded-lg'
          />

          {errors.email && (
            <p className='text-sm to-red-500'>{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
           type="password" 
           placeholder='Password'  
           {...register("password")}
           className='w-full border p-2 rounded-lg'
          />

          {errors.password && (
            <p className='text-sm to-red-500'>{errors.password.message}</p>
          )}
        </div>

        <button className='w-full rounded-lg bg-gray-600 text-white hover:bg-black hover:text-white p-2 cursor-pointer'>
          Login
        </button>


      </form>
    </div>
  )
}

export default Login