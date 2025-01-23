import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProjectSubmissionFormProps {
  walletAddress: string | null;
  isEligible: boolean;
  onSubmitSuccess: () => void;
}

interface Milestone {
  title: string;
  description: string;
  target_date: string;
  order_index: number;
}

interface TokenCreationData {
  name: string;
  symbol: string;
  description: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  image?: File;
  tokenAllocationPercentage: number;
}

const ProjectSubmissionForm = ({
  walletAddress,
  isEligible,
  onSubmitSuccess,
}: ProjectSubmissionFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    description: "",
    fundingGoal: "",
    image: null as File | null,
  });

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [includeToken, setIncludeToken] = useState(false);
  const [tokenInfo, setTokenInfo] = useState({
    name: "",
    symbol: "",
    description: "",
    twitter: "",
    telegram: "",
    website: "",
    image: null as File | null,
    tokenAllocationPercentage: 0,
  });

  const steps = [
    {
      title: "Basic Information",
      component: () => (
        <div className="space-y-4">
          <div>
            <Label>Project Name</Label>
            <Input
              value={basicInfo.title}
              onChange={(e) =>
                setBasicInfo((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label>Website</Label>
            <Input placeholder="https://" />
          </div>
        </div>
      ),
    },
    {
      title: "Project Description",
      component: () => (
        <div className="space-y-4">
          <div>
            <Label>Description</Label>
            <Textarea
              value={basicInfo.description}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
            />
          </div>
          <div>
            <Label>Target Market</Label>
            <Input placeholder="Who is this project for?" />
          </div>
        </div>
      ),
    },
    {
      title: "Tokenomics",
      component: () => (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="token-creation"
                checked={includeToken}
                onCheckedChange={setIncludeToken}
              />
              <Label htmlFor="token-creation">Create Token for Project</Label>
            </div>

            {includeToken && (
              <div className="space-y-4 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium">Token Information</h3>

                <div>
                  <Label>Token Name</Label>
                  <Input
                    value={tokenInfo.name}
                    onChange={(e) =>
                      setTokenInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required={includeToken}
                  />
                </div>

                <div>
                  <Label>Token Symbol</Label>
                  <Input
                    value={tokenInfo.symbol}
                    onChange={(e) =>
                      setTokenInfo((prev) => ({
                        ...prev,
                        symbol: e.target.value,
                      }))
                    }
                    required={includeToken}
                  />
                </div>

                <div>
                  <Label>Token Description</Label>
                  <Textarea
                    value={tokenInfo.description}
                    onChange={(e) =>
                      setTokenInfo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required={includeToken}
                  />
                </div>

                <div>
                  <Label>Twitter URL</Label>
                  <Input
                    type="url"
                    value={tokenInfo.twitter}
                    onChange={(e) =>
                      setTokenInfo((prev) => ({
                        ...prev,
                        twitter: e.target.value,
                      }))
                    }
                    placeholder="https://twitter.com/..."
                    required={includeToken}
                  />
                </div>

                <div>
                  <Label>Telegram URL</Label>
                  <Input
                    type="url"
                    value={tokenInfo.telegram}
                    onChange={(e) =>
                      setTokenInfo((prev) => ({
                        ...prev,
                        telegram: e.target.value,
                      }))
                    }
                    placeholder="https://t.me/..."
                    required={includeToken}
                  />
                </div>

                <div>
                  <Label>Website URL</Label>
                  <Input
                    type="url"
                    value={tokenInfo.website}
                    onChange={(e) =>
                      setTokenInfo((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    required={includeToken}
                  />
                </div>

                <div>
                  <Label>Token Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "token")}
                    required={includeToken}
                  />
                </div>

                <div>
                  <Label>Token Allocation (% of raised SOL)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={tokenInfo.tokenAllocationPercentage}
                    onChange={(e) =>
                      setTokenInfo((prev) => ({
                        ...prev,
                        tokenAllocationPercentage: Number(e.target.value),
                      }))
                    }
                    required={includeToken}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Team Information",
      component: () => (
        <div className="space-y-4">
          <div>
            <Label>Team Size</Label>
            <RadioGroup defaultValue="small">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="small"
                  id="small"
                  className="border-2 border-gray-300 checked:border-green-500"
                />
                <Label htmlFor="small">1-5</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="medium"
                  id="medium"
                  className="border-2 border-gray-300 checked:border-green-500"
                />
                <Label htmlFor="medium">6-15</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="large"
                  id="large"
                  className="border-2 border-gray-300 checked:border-green-500"
                />
                <Label htmlFor="large">15+</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label>LinkedIn Profiles</Label>
            <Textarea placeholder="Enter team LinkedIn profiles..." />
          </div>
        </div>
      ),
    },
    {
      title: "Review & Submit",
      component: () => (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Please review your submission carefully before submitting.
          </p>
          <Button
            onClick={onSubmitSuccess}
            className="w-full"
            disabled={!isEligible}
          >
            Submit Project
          </Button>
        </div>
      ),
    },
  ];

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "project" | "token"
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (type === "project") {
        setBasicInfo((prev) => ({ ...prev, image: e.target.files![0] }));
      } else {
        setTokenInfo((prev) => ({ ...prev, image: e.target.files![0] }));
      }
    }
  };

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: "",
        description: "",
        target_date: "",
        order_index: milestones.length,
      },
    ]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(
      milestones
        .filter((_, i) => i !== index)
        .map((m, i) => ({ ...m, order_index: i }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement submission logic here
    // Include token creation if includeToken is true
  };

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
                onClick={() => setCurrentStep((prev) => prev - 1)}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentStep ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
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
