"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const { toast } = useToast()
  const fileInputRef = useRef(null)

  const [userInfo, setUserInfo] = useState({
    name: "Usuario Ejemplo",
    email: "usuario@ejemplo.com",
    bio: "Estudiante de ingeniería informática. Apasionado por la programación y el desarrollo web.",
    university: "Universidad Nacional",
    career: "Ingeniería Informática",
    semester: "5to semestre",
    profileImage: null,
  })

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUserInfo({
          ...userInfo,
          profileImage: e.target.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = () => {
    toast({
      title: "Perfil actualizado",
      description: "Tu información de perfil ha sido actualizada correctamente",
      variant: "success",
    })
  }

  const handlePasswordUpdate = () => {
    if (!passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmPassword) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido actualizada correctamente",
      variant: "success",
    })

    setPasswordInfo({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Perfil</h2>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Información personal</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
              <CardDescription>Actualiza tu información personal y foto de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-32 w-32 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    {userInfo.profileImage ? (
                      <AvatarImage src={userInfo.profileImage} alt="Avatar" />
                    ) : (
                      <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Avatar" />
                    )}
                    <AvatarFallback className="text-3xl">
                      {userInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current.click()}>
                    Cambiar foto
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      value={userInfo.bio}
                      onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="university">Universidad</Label>
                  <Input
                    id="university"
                    value={userInfo.university}
                    onChange={(e) => setUserInfo({ ...userInfo, university: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="career">Carrera</Label>
                  <Input
                    id="career"
                    value={userInfo.career}
                    onChange={(e) => setUserInfo({ ...userInfo, career: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="semester">Semestre</Label>
                  <Input
                    id="semester"
                    value={userInfo.semester}
                    onChange={(e) => setUserInfo({ ...userInfo, semester: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileUpdate}>Guardar cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>Actualiza tu contraseña y configura opciones de seguridad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordInfo.currentPassword}
                    onChange={(e) => setPasswordInfo({ ...passwordInfo, currentPassword: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordInfo.newPassword}
                      onChange={(e) => setPasswordInfo({ ...passwordInfo, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordInfo.confirmPassword}
                      onChange={(e) => setPasswordInfo({ ...passwordInfo, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handlePasswordUpdate}>Actualizar contraseña</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

