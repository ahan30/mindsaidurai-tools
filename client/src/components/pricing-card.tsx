import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PricingFeature {
  text: string;
  included?: boolean;
}

interface PricingPlan {
  name: string;
  price: number;
  period?: string;
  description: string;
  features: (string | PricingFeature)[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  popular?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSelectPlan: () => void;
}

export default function PricingCard({ plan, onSelectPlan }: PricingCardProps) {
  const isFeatureIncluded = (feature: string | PricingFeature): boolean => {
    if (typeof feature === 'string') return true;
    return feature.included !== false;
  };

  const getFeatureText = (feature: string | PricingFeature): string => {
    if (typeof feature === 'string') return feature;
    return feature.text;
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card 
        className={`glass border-white/10 hover:bg-white/10 transition-all h-full ${
          plan.popular ? 'border-2 border-purple-500/50 relative' : ''
        }`}
      >
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="gradient-primary px-4 py-1 text-sm font-semibold">
              Most Popular
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
          
          <div className="mb-4">
            <div className="text-4xl font-bold mb-1">
              ${plan.price}
              {plan.period && (
                <span className="text-lg text-gray-400 font-normal">/{plan.period}</span>
              )}
            </div>
            {plan.price > 0 && (
              <div className="text-sm text-purple-400">
                Save 20% with yearly billing
              </div>
            )}
          </div>
          
          <p className="text-gray-400">{plan.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Features List */}
          <ul className="space-y-4">
            {plan.features.map((feature, index) => {
              const included = isFeatureIncluded(feature);
              const text = getFeatureText(feature);
              
              return (
                <li key={index} className="flex items-start">
                  <i 
                    className={`${
                      included ? 'fas fa-check text-green-400' : 'fas fa-times text-gray-500'
                    } mr-3 mt-0.5 flex-shrink-0`}
                  ></i>
                  <span className={included ? 'text-white' : 'text-gray-500'}>
                    {text}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* CTA Button */}
          <Button
            onClick={onSelectPlan}
            variant={plan.buttonVariant}
            className={`w-full py-3 ${
              plan.buttonVariant === 'default'
                ? 'gradient-primary hover:shadow-lg hover:shadow-purple-500/25'
                : 'glass border-white/20 hover:border-purple-400/50'
            } transition-all font-semibold`}
          >
            {plan.buttonText}
          </Button>

          {/* Additional Info */}
          {plan.name === 'Pro' && (
            <div className="text-center text-sm text-gray-400 space-y-1">
              <p>✨ 14-day free trial</p>
              <p>🚀 Cancel anytime</p>
            </div>
          )}
          
          {plan.name === 'Enterprise' && (
            <div className="text-center text-sm text-gray-400 space-y-1">
              <p>🤝 Custom onboarding</p>
              <p>📞 Dedicated support</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
