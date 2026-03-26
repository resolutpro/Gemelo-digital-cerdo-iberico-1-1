import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer } from "@/components/layout/footer";
/* IMPORTAMOS LOS ICONOS DE LUCIDE PARA UNA ESTÉTICA PERFECTA */
import {
  Loader2,
  Cpu,
  Activity,
  Link as LinkIcon,
  QrCode,
  ShieldCheck,
} from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationEmail: "",
  });

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      return;
    }
    registerMutation.mutate({
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      organizationName: registerForm.organizationName,
      organizationEmail: registerForm.organizationEmail,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-screen">
          {/* Left side - Auth forms */}
          <div className="max-w-md mx-auto w-full">
            {/* Logo de la plataforma usando Lucide */}
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Cpu className="h-10 w-10 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Sistema de Trazabilidad Ganadera
              </h1>
              <p className="text-muted-foreground">
                Plataforma de Trazabilidad IoT y Blockchain
              </p>
            </div>

            {/* Auth Forms */}
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Iniciar Sesión</CardTitle>
                    <CardDescription>
                      Ingresa a tu cuenta para acceder al sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Correo electrónico</Label>
                        <Input
                          id="login-email"
                          type="email"
                          data-testid="input-login-email"
                          placeholder="usuario@empresa.com"
                          value={loginForm.email}
                          onChange={(e) =>
                            setLoginForm({
                              ...loginForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Contraseña</Label>
                        <Input
                          id="login-password"
                          type="password"
                          data-testid="input-login-password"
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) =>
                            setLoginForm({
                              ...loginForm,
                              password: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        data-testid="button-login"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Iniciar sesión
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Crear Cuenta</CardTitle>
                    <CardDescription>
                      Registra tu organización en el sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-username">Usuario</Label>
                          <Input
                            id="register-username"
                            data-testid="input-register-username"
                            placeholder="usuario"
                            value={registerForm.username}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                username: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-email">Email personal</Label>
                          <Input
                            id="register-email"
                            type="email"
                            data-testid="input-register-email"
                            placeholder="tu@email.com"
                            value={registerForm.email}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-org-name">
                          Nombre de la organización
                        </Label>
                        <Input
                          id="register-org-name"
                          data-testid="input-register-org-name"
                          placeholder="Nombre de la empresa"
                          value={registerForm.organizationName}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              organizationName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-org-email">
                          Email de la organización
                        </Label>
                        <Input
                          id="register-org-email"
                          type="email"
                          data-testid="input-register-org-email"
                          placeholder="contacto@empresa.com"
                          value={registerForm.organizationEmail}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              organizationEmail: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-password">Contraseña</Label>
                          <Input
                            id="register-password"
                            type="password"
                            data-testid="input-register-password"
                            placeholder="••••••••"
                            value={registerForm.password}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-confirm">
                            Confirmar contraseña
                          </Label>
                          <Input
                            id="register-confirm"
                            type="password"
                            data-testid="input-register-confirm"
                            placeholder="••••••••"
                            value={registerForm.confirmPassword}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        data-testid="button-register"
                        disabled={
                          registerMutation.isPending ||
                          registerForm.password !== registerForm.confirmPassword
                        }
                      >
                        {registerMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Crear cuenta
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right side - Hero section Actualizado con Lucide React */}
          <div className="hidden lg:block">
            <div className="text-center space-y-6">
              <div className="mb-8">
                {/* Shield/Security illustration en tonos esmeralda */}
                <div className="mx-auto w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200">
                  <ShieldCheck
                    className="h-16 w-16 text-emerald-600"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <h2 className="text-4xl font-bold text-foreground">
                Trazabilidad Inteligente y Segura
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Registra de manera inmutable cada etapa productiva mediante
                sensores IoT, inteligencia artificial y contratos inteligentes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
                {/* Feature 1: Métricas */}
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-center mx-auto mb-3 transition-transform hover:scale-105">
                    <Activity
                      className="w-8 h-8 text-emerald-600"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Métricas en Tiempo Real
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Análisis predictivo (IA/ML) apoyado en sensores IoT
                  </p>
                </div>

                {/* Feature 2: Blockchain */}
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-lg flex items-center justify-center mx-auto mb-3 transition-transform hover:scale-105">
                    <LinkIcon
                      className="w-8 h-8 text-teal-600"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Blockchain
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Registro inmutable de toda la cadena de valor
                  </p>
                </div>

                {/* Feature 3: Código QR (Arreglado) */}
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-lg flex items-center justify-center mx-auto mb-3 transition-transform hover:scale-105">
                    <QrCode className="w-8 h-8 text-cyan-600" strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Transparencia QR
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Generación de certificados verificables al instante
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
