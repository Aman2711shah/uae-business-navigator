import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Download, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BottomNavigation from "@/components/BottomNavigation";

interface SubmissionDetails {
  id: string;
  status: string;
  payment_status: string;
  total_price: number;
  payment_currency: string;
  contact_info: any;
  service_id: string;
  sub_service_id: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<SubmissionDetails | null>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      // Call our edge function to verify payment
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) throw error;

      if (data.success && data.submission) {
        setSubmission(data.submission);
        
        // Show success message with submission ID
        toast({
          title: "Payment Received!",
          description: `Your request (ID: ${data.submission.id}) is confirmed.`,
          variant: "default"
        });
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Verification Error",
        description: "Failed to verify payment. Please contact support if you were charged.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Link to="/services">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Payment Successful</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Payment Received!
            </h2>
            <p className="text-green-700 mb-4">
              Your request (ID: {submission?.id}) is confirmed and being processed.
            </p>
            
            {submission && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground">Application ID</p>
                    <p className="font-mono font-semibold">{submission.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="font-semibold">
                      {submission.total_price} {submission.payment_currency?.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold capitalize">{submission.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <p className="font-semibold capitalize text-green-600">{submission.payment_status}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Our team will review your application within 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>We'll contact you with updates and next steps</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>Any additional requirements will be communicated promptly</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>You'll receive regular updates on your application status</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              // Generate a simple receipt
              const receiptContent = `
PAYMENT RECEIPT
===============
Application ID: ${submission?.id || 'N/A'}
Amount: ${submission?.total_price || 'N/A'} ${submission?.payment_currency?.toUpperCase() || 'AED'}
Status: ${submission?.payment_status || 'N/A'}
Date: ${new Date().toLocaleDateString()}
              `;
              
              const blob = new Blob([receiptContent], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `receipt-${submission?.id || 'payment'}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          
          <Button 
            className="w-full"
            onClick={() => {
              // Option for callback request
              toast({
                title: "Support Requested",
                description: "Our team will contact you within 30 minutes.",
                variant: "default"
              });
            }}
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        </div>

        <div className="text-center">
          <Link to="/services">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PaymentSuccess;