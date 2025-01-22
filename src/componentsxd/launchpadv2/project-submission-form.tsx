import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ProjectSubmissionForm = ({ walletAddress, isEligible, onSubmitSuccess }: { walletAddress: string, isEligible: boolean, onSubmitSuccess: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Project Category",
      component: () => (
        <div className="space-y-4">
          <Select >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-black">
              <SelectItem value="defi">DeFi</SelectItem>
              <SelectItem value="nft">NFT</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent className="bg-black">
              <SelectItem value="lending">Lending</SelectItem>
              <SelectItem value="dex">DEX</SelectItem>
              <SelectItem value="yield">Yield</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    },
    {
      title: "Basic Information",
      component: () => (
        <div className="space-y-4">
          <div>
            <Label>Project Name</Label>
            <Input placeholder="Enter project name" />
          </div>
          <div>
            <Label>Website</Label>
            <Input placeholder="https://" />
          </div>
        </div>
      )
    },
    {
      title: "Project Description",
      component: () => (
        <div className="space-y-4">
          <div>
            <Label>Description</Label>
            <Textarea placeholder="Describe your project..." className="h-32" />
          </div>
          <div>
            <Label>Target Market</Label>
            <Input placeholder="Who is this project for?" />
          </div>
        </div>
      )
    },
    {
      title: "Tokenomics",
      component: () => (
        <div className="space-y-4">
          <div>
            <Label>Token Name</Label>
            <Input placeholder="Enter token name" />
          </div>
          <div>
            <Label>Total Supply</Label>
            <Input type="number" placeholder="Enter total supply" />
          </div>
        </div>
      )
    },
    {
      title: "Team Information",
      component: () => (
        <div className="space-y-4">
          <div>
            <Label>Team Size</Label>
            <RadioGroup defaultValue="small">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small" className="border-2 border-gray-300 checked:border-green-500" />
                <Label htmlFor="small">1-5</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" className="border-2 border-gray-300 checked:border-green-500" />
                <Label htmlFor="medium">6-15</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" className="border-2 border-gray-300 checked:border-green-500" />
                <Label htmlFor="large">15+</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label>LinkedIn Profiles</Label>
            <Textarea placeholder="Enter team LinkedIn profiles..." />
          </div>
        </div>
      )
    },
    {
      title: "Review & Submit",
      component: () => (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Please review your submission carefully before submitting.</p>
          <Button 
            onClick={onSubmitSuccess} 
            className="w-full"
            disabled={!isEligible}
          >
            Submit Project
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px]">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-auto">
            {steps[currentStep].component()}
          </div>
          
          <div className="mt-8">
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentStep === steps.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSubmissionForm;