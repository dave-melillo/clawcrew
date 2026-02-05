'use client';

import { useState } from 'react';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCrewStore } from '@/lib/store';
import { Plus, Radio, MessageSquare } from 'lucide-react';
import { TelegramWizard } from '@/components/telegram-wizard';
import { Channel } from '@/types';

export default function ChannelsPage() {
  const { channels, deleteChannel, updateChannel } = useCrewStore();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'telegram' | 'discord' | null>(null);
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to disconnect this channel?')) {
      deleteChannel(id);
    }
  };
  
  const handleToggle = (channel: Channel) => {
    updateChannel(channel.id, { enabled: !channel.enabled });
  };
  
  if (showWizard && selectedChannel) {
    return (
      <>
        <Nav />
        <TelegramWizard
          onComplete={(channel) => {
            setShowWizard(false);
            setSelectedChannel(null);
          }}
          onCancel={() => {
            setShowWizard(false);
            setSelectedChannel(null);
          }}
        />
      </>
    );
  }
  
  return (
    <>
      <Nav />
      <main className="container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Channels</h1>
          <p className="text-muted-foreground text-lg">
            Connect your AI crew to messaging platforms
          </p>
        </div>
        
        {/* Connected Channels */}
        {channels.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Connected Channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channels.map((channel) => (
                <Card key={channel.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          {channel.type === 'telegram' && '📱'}
                          {channel.type === 'discord' && '🎮'}
                        </div>
                        <div>
                          <CardTitle>{channel.name}</CardTitle>
                          <CardDescription className="capitalize">
                            {channel.type}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant={channel.enabled ? 'default' : 'outline'}
                      >
                        {channel.enabled ? '● Active' : '○ Disabled'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge 
                          variant={
                            channel.status === 'connected' ? 'default' :
                            channel.status === 'error' ? 'destructive' :
                            'outline'
                          }
                        >
                          {channel.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Agents:</span>
                        <span>{channel.agents.length || 'All'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleToggle(channel)}
                      >
                        {channel.enabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(channel.id)}
                        className="text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Available Channels */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Connect New Channel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Telegram */}
            <Card className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => {
              setSelectedChannel('telegram');
              setShowWizard(true);
            }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">📱</div>
                  <div>
                    <CardTitle>Telegram</CardTitle>
                    <CardDescription>Easy • 5 minutes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect via Telegram bot. Perfect for personal use and small teams.
                </p>
                <Button className="w-full group-hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Telegram
                </Button>
              </CardContent>
            </Card>
            
            {/* Discord */}
            <Card className="opacity-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">🎮</div>
                  <div>
                    <CardTitle>Discord</CardTitle>
                    <CardDescription>Medium • 10 minutes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Bot for Discord servers. Great for communities and teams.
                </p>
                <Button className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
            
            {/* More channels */}
            <Card className="opacity-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">💬</div>
                  <div>
                    <CardTitle>More Channels</CardTitle>
                    <CardDescription>Slack, WhatsApp, Email...</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Additional channels coming in future updates.
                </p>
                <Button className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Empty State */}
        {channels.length === 0 && (
          <div className="text-center py-16 mb-8">
            <div className="text-6xl mb-4">📡</div>
            <h3 className="text-2xl font-semibold mb-2">No channels connected</h3>
            <p className="text-muted-foreground mb-6">
              Connect your first channel to start using your AI crew
            </p>
          </div>
        )}
      </main>
    </>
  );
}
