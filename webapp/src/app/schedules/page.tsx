'use client';

import { Nav } from '@/components/nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';

export default function SchedulesPage() {
  return (
    <>
      <Nav />
      <main className="container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Schedules</h1>
          <p className="text-muted-foreground text-lg">
            Automated tasks and briefings
          </p>
        </div>
        
        {/* Coming Soon */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-8 w-8 text-muted-foreground" />
              <CardTitle>Coming Soon</CardTitle>
            </div>
            <CardDescription>
              Schedule Manager is coming in the next release
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Soon you'll be able to:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-6">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Set up daily briefings and reminders
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Create recurring automated tasks
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule agent actions at specific times
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Build custom briefings with multiple data sources
              </li>
            </ul>
            
            <div className="pt-4">
              <Button disabled>Create Schedule</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
