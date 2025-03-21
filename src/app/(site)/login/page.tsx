"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github, Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import useStore from "@/store/useStore";

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isHomePage = usePathname() === "/";
  const { setCurrentUserId } = useStore();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.status === 400) {
        toast({
          variant: "destructive",
          title: "Thất bại!",
          description: "Thiếu email hoặc mật khẩu!",
        });
      } else if (result?.status === 401) {
        toast({
          variant: "destructive",
          title: "Thất bại!",
          description: "Email hoặc mật khẩu không hợp lệ!",
        });
      } else if (result?.status === 200) {
        toast({
          variant: "default",
          title: "Thành công!",
          description: "Đăng nhập thành công!",
        });
        
        try {
          const userResponse = await fetch('/api/auth/session');
          const userData = await userResponse.json();
          if (userData?.user?.id) {
            setCurrentUserId(userData.user.id);
            if (userData.user.lastConversationId) {
              router.push(`/t/${userData.user.lastConversationId}`);
            } else {
              router.push("/t/user-suggested");
            }
          } else {
            router.push("/t/user-suggested");
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
          router.push("/t/user-suggested");
        }
      }
    } catch (result: any) {
      console.error("Lỗi đăng nhập:", result);
    } finally {
      setIsLoading(false);
    }
  };

  return isHomePage ? (
    <div className="w-full max-w-md mx-auto bg-primary-foreground border p-6 rounded-md h-fit flex flex-col gap-3 items-center">
      <div className="w-full h-10 relative flex flex-row justify-center">
        <Image
          layout="fill"
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/800px-Facebook_Messenger_logo_2020.svg.png"
          }
          alt="messenger-icon"
          className="object-contain rounded-md pointer-events-none"
        />
      </div>
      <h1 className="text-2xl font-bold">Đăng nhập tài khoản</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full flex gap-2 items-center self-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          variant={"default"}
        >
          {isLoading ? (
            <>
              Đang đăng nhập
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Đăng nhập
              <LogIn className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      <div className="grid grid-cols-3 items-center gap-2 justify-between mt-4 mb-2 w-full">
        <Separator className="dark:bg-zinc-600" />
        <span className="text-zinc-300 dark:text-zinc-500 text-sm self-center text-center">
          Hoặc tiếp tục với
        </span>
        <Separator className="dark:bg-zinc-600" />
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button
          variant="outline"
          onClick={() => signIn("github", { callbackUrl: "/t/user-suggested" })}
        >
          <Github className="mr-2 h-4 w-4" />
          Github
        </Button>
        <Button
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/t/user-suggested" })}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Google
        </Button>
      </div>
      <div className="flex flex-row gap-2 mt-2">
        <span className="text-zinc-300 dark:text-zinc-500 text-sm self-center text-center">
          Bạn chưa có tài khoản?
        </span>
        <Link href="/signup" className="text-sm text-zinc-300 underline">
          Tạo tài khoản
        </Link>
      </div>
    </div>
  ) : null;
}
