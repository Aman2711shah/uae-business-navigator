import { useSearchParams, Link } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get('submission_id');

  const handleRetryPayment = () => {
    // Navigate back to the submission or trigger payment flow again
    if (submissionId) {
      // You could navigate to a specific route or trigger the payment modal again
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-20">
      <div className="bg-white border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Link to="/services">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Payment Cancelled</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-center">
            <XCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-orange-800 mb-2">
              Payment Cancelled
            </h2>
            <p className="text-orange-700 mb-4">
              Your payment was cancelled. Don't worry, no charges were made to your account.
            </p>
            
            {submissionId && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm text-muted-foreground">Application ID</p>
                <p className="font-mono font-semibold">{submissionId}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your application is saved and waiting for payment
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">What would you like to do?</h3>
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={handleRetryPayment}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Payment Again
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  // Contact support option
                  window.location.href = 'mailto:support@yourcompany.com?subject=Payment Support Needed';
                }}
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Your application has been saved and will remain active for 7 days</li>
              <li>• You can complete the payment at any time during this period</li>
              <li>• If you're experiencing payment issues, our support team can help</li>
              <li>• Alternative payment methods may be available - contact us to discuss</li>
            </ul>
          </CardContent>
        </Card>

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

export default PaymentCancel;