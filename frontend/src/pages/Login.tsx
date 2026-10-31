import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from 'zod'
import { loginUser } from '../services/auth.service';
import { setAccessToken } from '../slices/auth.slice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10 sm:px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-sm">
            TF
          </span>
          <p className="text-sm font-medium text-muted-foreground">TaskFlow</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to continue to your projects.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
