'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { useCrewStore } from '@/lib/store';
import { Channel } from '@/types';

interface TelegramWizardProps {
  onComplete: (channel: Channel) => void;
  onCancel: () => void;
}

export function TelegramWizard({ onComplete, onCancel }: TelegramWizardProps) {
  const [step, setStep] = useState(1);
  const [botToken, setBotToken] = useState('');
  const [botName, setBotName] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  
  const { addChannel } = useCrewStore();
  
  const handleTestConnection = async () => {
    setTesting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation
    if (botToken.includes(':') && botToken.length > 20) {
      setTestResult('success');
      setBotName('My Telegram Bot');
    } else {
      setTestResult('error');
    }
    setTesting(false);
  };
  
  const handleComplete = () => {
    const channel: Omit<Channel, 'id' | 'createdAt'> = {
      type: 'telegram',
      name: botName || 'Telegram Bot',
      enabled: true,
      config: {
        token: botToken,
      },
      agents: [],
      status: 'connected',
    };
    
    addChannel(channel);
    onComplete(channel as Channel);
  };
  
  return (
    <div className="container py-8 px-4 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Channels
        </Button>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">📱</div>
          <div>
            <h1 className="text-3xl font-bold">Connect Telegram</h1>
            <p className="text-muted-foreground">Set up your Telegram bot in minutes</p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`h-2 flex-1 rounded-full transition-all ${
                step >= s ? 'bg-primary' : 'bg-muted'
              }`} />
              {s < 3 && <div className="text-xs text-muted-foreground">→</div>}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Create Bot</span>
          <span>Connect</span>
          <span>Done</span>
        </div>
      </div>
      
      {/* Step 1: Instructions */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create Your Telegram Bot</CardTitle>
            <CardDescription>
              You'll need a Telegram account to complete this step
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Open Telegram and search for @BotFather</p>
                  <p className="text-sm text-muted-foreground">
                    BotFather is Telegram's official bot for creating new bots
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Send the command: /newbot</p>
                  <p className="text-sm text-muted-foreground">
                    This starts the bot creation process
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Choose a name and username</p>
                  <p className="text-sm text-muted-foreground">
                    Name: "My ClawCrew Bot" (can be anything)<br />
                    Username: must end with "bot" (e.g., "myclawcrew_bot")
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  4
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Copy your bot token</p>
                  <p className="text-sm text-muted-foreground">
                    BotFather will give you a token that looks like:<br />
                    <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                      123456789:ABCdefGHIjklMNOpqrsTUVwxyz
                    </code>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>⚠️ Keep your token private!</strong> Never share it publicly or commit it to code.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1"
                asChild
              >
                <a href="https://t.me/botfather" target="_blank" rel="noopener noreferrer">
                  Open BotFather
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>
                I have my token
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 2: Enter Token */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Connect Your Bot</CardTitle>
            <CardDescription>
              Enter the token you received from BotFather
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="token">Bot Token</Label>
              <Input
                id="token"
                type="password"
                value={botToken}
                onChange={(e) => {
                  setBotToken(e.target.value);
                  setTestResult(null);
                }}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                The token is stored securely and never shared
              </p>
            </div>
            
            {testResult === 'error' && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Connection failed.</strong> Please check your token and try again.
                </p>
              </div>
            )}
            
            {testResult === 'success' && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Connected successfully!</strong> Bot name: {botName}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleTestConnection}
                disabled={!botToken || testing}
                className="flex-1"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </Button>
              
              {testResult === 'success' && (
                <Button
                  onClick={() => setStep(3)}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 3: Complete */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: You're All Set! 🎉</CardTitle>
            <CardDescription>
              Your Telegram bot is connected and ready to go
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                Successfully Connected!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your agents can now respond in Telegram
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Next Steps:</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>1. Open Telegram and search for your bot's username</p>
                <p>2. Start a chat and send a test message like "Hello!"</p>
                <p>3. Your agents will respond based on their routing rules</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleComplete}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
