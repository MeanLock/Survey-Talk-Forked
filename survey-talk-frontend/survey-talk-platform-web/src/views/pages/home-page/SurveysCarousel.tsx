import type React from "react";
import type { SurveyCommunity } from "../../../core/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SurveyCard } from "./SurveyCard";

interface Props {
  prefix: string;
  data: SurveyCommunity[] | null;
}

export const SurveysCarousel: React.FC<Props> = ({ prefix, data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {data.length === 1 ? (
        // Single card - center it
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <SurveyCard data={data[0]} />
          </div>
        </div>
      ) : (
        // Multiple cards - use carousel
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4 gap-20">
            {data.map((survey, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="p-1">
                  <SurveyCard data={survey} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      )}
    </div>
  );
};
