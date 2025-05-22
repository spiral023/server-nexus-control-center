
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from "lucide-react";

const Help = () => {
  return (
    <div className="container py-6 space-y-8 max-w-4xl">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">Server Manager Help</h1>
      </div>
      <p className="text-muted-foreground">
        This guide will help you understand how to use the Server Management System effectively.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>How to get started with the Server Manager</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            The Server Management System provides a centralized interface for managing
            all your server systems, both physical and virtual. Here's how to get started:
          </p>
          
          <div className="space-y-2">
            <h3 className="font-semibold">1. Navigate the Interface</h3>
            <p>
              Use the top navigation bar to switch between the Server List, Dashboard,
              and Help sections. The Server List is your main view for managing servers.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">2. View Server Details</h3>
            <p>
              Click on any server row to view its complete details. The detail view
              shows all server properties and provides access to the change history.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">3. Add New Servers</h3>
            <p>
              Click the "Add Server" button to create a new server record. Fill in
              the required fields in the form and submit to add it to the inventory.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">4. Use Search and Filters</h3>
            <p>
              Use the search bar to find servers quickly. Add filters to narrow down
              the list based on specific criteria like server type or location.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Separator />
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I save my preferred view settings?</AccordionTrigger>
            <AccordionContent>
              <p>
                To save your current view settings (visible columns, filters, and sorting):
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Set up your filters, column visibility, and sorting as desired</li>
                <li>Click the "Views" button in the action bar</li>
                <li>Select "Save Current View"</li>
                <li>Enter a name for your view and save</li>
              </ol>
              <p className="mt-2">
                Your saved view will be available in the Views menu for quick access later.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>How do I export server data?</AccordionTrigger>
            <AccordionContent>
              <p>
                To export your server data:
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Apply any filters needed to select the servers you want to export</li>
                <li>Click the "Export" button in the action bar</li>
                <li>Choose either "Export as CSV" or "Export as Excel"</li>
                <li>The file will be automatically downloaded to your device</li>
              </ol>
              <p className="mt-2">
                Only the data from your current filtered view and visible columns will be exported.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>How do I track changes to a server?</AccordionTrigger>
            <AccordionContent>
              <p>
                Each server has a complete history of all changes:
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Click on a server row to open the server detail view</li>
                <li>Click on the "History" tab</li>
                <li>You'll see a chronological list of all changes made to the server</li>
                <li>Each entry shows the date, user, changed field, and old/new values</li>
              </ol>
              <p className="mt-2">
                This audit log helps maintain accountability and track the server's lifecycle.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>How do I perform bulk operations?</AccordionTrigger>
            <AccordionContent>
              <p>
                To perform actions on multiple servers at once:
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Select servers by checking the boxes in the leftmost column</li>
                <li>You can select all servers on the current page using the header checkbox</li>
                <li>Once servers are selected, bulk action buttons will appear in the action bar</li>
                <li>You can delete multiple servers or add tags to them in bulk</li>
              </ol>
              <p className="mt-2">
                Bulk operations help you manage your server inventory more efficiently.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>What do the different colors and indicators mean?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <p>The system uses color coding to help you identify server attributes quickly:</p>
                
                <div>
                  <strong>Server Types:</strong>
                  <ul className="list-disc list-inside pl-4 mt-1">
                    <li><span className="inline-block w-3 h-3 rounded-full bg-status-prod mr-1"></span> Green - Production servers</li>
                    <li><span className="inline-block w-3 h-3 rounded-full bg-status-test mr-1"></span> Blue - Test servers</li>
                    <li><span className="inline-block w-3 h-3 rounded-full bg-status-dev mr-1"></span> Amber - Development servers</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Hardware Types:</strong>
                  <ul className="list-disc list-inside pl-4 mt-1">
                    <li>Blue background - VMware virtual machines</li>
                    <li>Amber background - Bare-Metal physical servers</li>
                  </ul>
                </div>
                
                <div>
                  <strong>Backup Status:</strong>
                  <ul className="list-disc list-inside pl-4 mt-1">
                    <li>Green check - Server has backups enabled</li>
                    <li>Red X - Server does not have backups</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Help;
