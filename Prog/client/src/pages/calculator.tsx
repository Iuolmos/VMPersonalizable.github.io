import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { emailRequestSchema, type EmailRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Mail, 
  Calculator as CalculatorIcon,
  Settings, 
  Send,
  Download,
  Shield,
  TrendingUp,
  Headphones,
  Github,
  FileText,
  Cloud
} from "lucide-react";

const PRICING = {
  cpu: 15.00,
  ram: 2.50,
  disk: 0.10
};

export default function Calculator() {
  const { toast } = useToast();
  const [resources, setResources] = useState({
    cpu: 2,
    ram: 8,
    disk: 100
  });

  const form = useForm<EmailRequest>({
    resolver: zodResolver(emailRequestSchema),
    defaultValues: {
      cpu: 2,
      ram: 8,
      disk: 100,
      email: ""
    }
  });

  const sendEmailMutation = useMutation({
    mutationFn: async (data: EmailRequest) => {
      const response = await apiRequest("POST", "/api/send-configuration", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send email. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: EmailRequest) => {
    sendEmailMutation.mutate(data);
  };

  const updateResource = (field: keyof typeof resources, value: number) => {
    const newResources = { ...resources, [field]: value };
    setResources(newResources);
    form.setValue(field, value);
  };

  const calculateCosts = () => {
    const cpuCost = resources.cpu * PRICING.cpu;
    const ramCost = resources.ram * PRICING.ram;
    const diskCost = resources.disk * PRICING.disk;
    const monthlyTotal = cpuCost + ramCost + diskCost;
    const annualTotal = monthlyTotal * 12;

    return { cpuCost, ramCost, diskCost, monthlyTotal, annualTotal };
  };

  const costs = calculateCosts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary flex items-center">
                <Cloud className="text-primary h-8 w-8 mr-3" />
                Cloud Resource Calculator
              </h1>
              <p className="text-gray-600 mt-2">Configure your cloud resources and get instant pricing</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Powered by CloudTech</span>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Settings className="text-white h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resource Configuration Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Settings className="text-primary h-6 w-6 mr-3" />
                  Resource Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* CPU Configuration */}
                    <Card className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-4">
                          <Cpu className="text-primary h-5 w-5 mr-3" />
                          <h3 className="text-lg font-medium text-secondary">CPU Cores</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FormField
                              control={form.control}
                              name="cpu"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Number of CPU Cores</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      max="64"
                                      {...field}
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value) || 1;
                                        field.onChange(value);
                                        updateResource('cpu', value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                            <span className="text-sm text-gray-600">Price per core:</span>
                            <span className="text-lg font-semibold text-primary">${PRICING.cpu.toFixed(2)}/month</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* RAM Configuration */}
                    <Card className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-4">
                          <MemoryStick className="text-primary h-5 w-5 mr-3" />
                          <h3 className="text-lg font-medium text-secondary">RAM Memory</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FormField
                              control={form.control}
                              name="ram"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>RAM in GB</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      max="512"
                                      {...field}
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value) || 1;
                                        field.onChange(value);
                                        updateResource('ram', value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                            <span className="text-sm text-gray-600">Price per GB:</span>
                            <span className="text-lg font-semibold text-primary">${PRICING.ram.toFixed(2)}/month</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Disk Configuration */}
                    <Card className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-4">
                          <HardDrive className="text-primary h-5 w-5 mr-3" />
                          <h3 className="text-lg font-medium text-secondary">Disk Storage</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <FormField
                              control={form.control}
                              name="disk"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Storage in GB</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="10"
                                      max="10000"
                                      {...field}
                                      onChange={(e) => {
                                        const value = parseInt(e.target.value) || 10;
                                        field.onChange(value);
                                        updateResource('disk', value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                            <span className="text-sm text-gray-600">Price per GB:</span>
                            <span className="text-lg font-semibold text-primary">${PRICING.disk.toFixed(2)}/month</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Email Configuration */}
                    <Card className="border-gray-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-4">
                          <Mail className="text-primary h-5 w-5 mr-3" />
                          <h3 className="text-lg font-medium text-secondary">Email Configuration</h3>
                        </div>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Gmail Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your.email@gmail.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Summary Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <CalculatorIcon className="text-primary h-6 w-6 mr-3" />
                  Pricing Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Resource Summary */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <Cpu className="text-gray-400 h-4 w-4 mr-2" />
                      <span className="text-sm text-gray-600">CPU Cores</span>
                      <span className="ml-2 text-sm font-medium">{resources.cpu}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">${costs.cpuCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <MemoryStick className="text-gray-400 h-4 w-4 mr-2" />
                      <span className="text-sm text-gray-600">RAM GB</span>
                      <span className="ml-2 text-sm font-medium">{resources.ram}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">${costs.ramCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <HardDrive className="text-gray-400 h-4 w-4 mr-2" />
                      <span className="text-sm text-gray-600">Storage GB</span>
                      <span className="ml-2 text-sm font-medium">{resources.disk}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">${costs.diskCost.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Total Cost */}
                <div className="bg-primary text-white rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Total:</span>
                    <span className="text-2xl font-bold">${costs.monthlyTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs opacity-80">Annual Total:</span>
                    <span className="text-lg font-semibold">${costs.annualTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={sendEmailMutation.isPending}
                    className="w-full bg-accent hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sendEmailMutation.isPending ? "Sending..." : "Send Configuration to Email"}
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="secondary"
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Quote (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-secondary mb-2">Secure & Reliable</h3>
              <p className="text-gray-600 text-sm">Enterprise-grade security with 99.9% uptime guarantee</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-secondary mb-2">Scalable Resources</h3>
              <p className="text-gray-600 text-sm">Scale up or down based on your needs with instant provisioning</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="text-white h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-secondary mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">Expert technical support available around the clock</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p>&copy; 2024 CloudTech Solutions. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-gray-300 hover:text-white transition duration-200 flex items-center">
                <Github className="h-4 w-4 mr-1" /> GitHub
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-200 flex items-center">
                <Mail className="h-4 w-4 mr-1" /> Contact
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-200 flex items-center">
                <FileText className="h-4 w-4 mr-1" /> Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
