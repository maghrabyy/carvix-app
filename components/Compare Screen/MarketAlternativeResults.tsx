import { Colors } from "@/colors";
import { QualificationBadge } from "@/components/QualificationBadge";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { VehicleCard } from "@/components/VehicleCard";
import { useCarComparison } from "@/hooks/query/useCarQueries";
import { GetCarComparisonRequestDTO } from "@/types/requestDTOs.type";
import { ComparisonRecommendation } from "@/types/responseDTOs.type";
import { ComparisonResultsFilter } from "@/components/Compare Screen/ComparisonResultsFilter";
import { useEffect, useState } from "react";

interface MarketAlternativeResultsProps {
  sellingPrice: number;
  vehicleData: Pick<
    GetCarComparisonRequestDTO,
    "brand" | "model" | "year" | "km" | "transmission"
  >;
  isFormValid: boolean;
  isComparisonFiltersValid: boolean;
  comparisonFilters: {
    sameBrand: boolean;
    setSameBrand: (val: boolean) => void;
    sameTransmission: boolean;
    setSameTransmission: (val: boolean) => void;
    sameYear: boolean;
    setSameYear: (val: boolean) => void;
    yearFrom: string;
    setYearFrom: (val: string) => void;
    yearTo: string;
    setYearTo: (val: string) => void;
    kmFrom: string;
    setKmFrom: (val: string) => void;
    kmTo: string;
    setKmTo: (val: string) => void;
    yearRangeError?: string;
    kmRangeError?: string;
  };
}
const MarketAlternativeResults = ({
  sellingPrice,
  vehicleData,
  isFormValid,
  isComparisonFiltersValid,
  comparisonFilters,
}: MarketAlternativeResultsProps) => {
  const [showResults, setShowResults] = useState(false);
  // Pagination State
  const [pageIndex, setPageIndex] = useState(0);
  const [accumulatedComparisons, setAccumulatedComparisons] = useState<
    ComparisonRecommendation[]
  >([]);

  const [comparisonSnapshot, setComparisonSnapshot] = useState<
    Omit<GetCarComparisonRequestDTO, "pageIndex" | "pageSize"> | undefined
  >(undefined);

  const toNumber = (value?: string): number | undefined => {
    if (!value) return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  };

  const comparisonParams: GetCarComparisonRequestDTO | undefined =
    comparisonSnapshot
      ? {
          ...comparisonSnapshot,
          pageIndex,
          pageSize: 1,
        }
      : undefined;

  const { data: comparisonData, isFetching: isComparing } = useCarComparison(
    (comparisonParams ??
      ({
        brand: "",
        model: "",
        year: 0,
        transmission: "automatic",
        km: 0,
        price: 0,
      } as GetCarComparisonRequestDTO)) as GetCarComparisonRequestDTO,
    showResults && !!comparisonParams,
  );

  const handleAnalyze = async () => {
    const yearFrom = comparisonFilters.sameYear
      ? undefined
      : toNumber(comparisonFilters.yearFrom.trim() || undefined);
    const yearTo = comparisonFilters.sameYear
      ? undefined
      : toNumber(comparisonFilters.yearTo.trim() || undefined);
    const kmFrom = toNumber(comparisonFilters.kmFrom.trim() || undefined);
    const kmTo = toNumber(comparisonFilters.kmTo.trim() || undefined);

    const snapshot: Omit<GetCarComparisonRequestDTO, "pageIndex" | "pageSize"> =
      {
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        km: vehicleData.km,
        transmission: vehicleData.transmission as "automatic" | "manual",
        price: sellingPrice,
        ...(comparisonFilters.sameBrand ? { sameBrand: true } : {}),
        ...(comparisonFilters.sameTransmission
          ? { sameTransmission: true }
          : {}),
        ...(comparisonFilters.sameYear ? { sameYear: true } : {}),
        ...(yearFrom !== undefined ? { yearFrom } : {}),
        ...(yearTo !== undefined ? { yearTo } : {}),
        ...(kmFrom !== undefined ? { kmFrom } : {}),
        ...(kmTo !== undefined ? { kmTo } : {}),
      };

    setComparisonSnapshot(snapshot);
    setPageIndex(0);
    setAccumulatedComparisons([]);
    setShowResults(true);
  };

  const handleShowNext = async () => {
    setPageIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (!showResults) return;
    if (!comparisonData?.vehicleRecommendations?.length) return;
    if (comparisonData.pageInfo?.pageIndex !== pageIndex) return;

    setAccumulatedComparisons((prev) =>
      pageIndex === 0
        ? comparisonData.vehicleRecommendations
        : [...prev, ...comparisonData.vehicleRecommendations],
    );
  }, [comparisonData, pageIndex, showResults]);

  return (
    <VStack style={{ gap: 16 }}>
      <ComparisonResultsFilter {...comparisonFilters} />

      <Button
        size="md"
        style={{ marginTop: 16, backgroundColor: Colors.primary }}
        isDisabled={!isFormValid || !isComparisonFiltersValid || isComparing}
        onPress={handleAnalyze}
      >
        {isComparing && (
          <Spinner size="small" color="white" style={{ marginRight: 8 }} />
        )}
        <ButtonText style={{ color: "white" }}>Analyse price</ButtonText>
      </Button>

      {showResults && (
        <>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: Colors.textPrimary,
            }}
          >
            Analysis Result
          </Text>
          {comparisonData ? (
            <QualificationBadge
              qualification={comparisonData.sellingPriceQualification}
              marketAvgPrice={comparisonData.priceRange?.highestPrice || 0}
              sellingPrice={sellingPrice}
            />
          ) : (
            <Spinner size="small" color={Colors.primary} />
          )}

          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: Colors.textPrimary,
              marginTop: 16,
            }}
          >
            Market Alternatives
          </Text>

          {accumulatedComparisons.map((v, i) => (
            <VehicleCard
              key={i}
              brand={v.brand}
              model={v.model}
              year={v.year}
              price={v.avgPrice}
              km={v.km}
              transmission={v.transmission}
              showSavingsBadge
            />
          ))}

          {!!comparisonData?.pageInfo?.hasNext && (
            <Button
              variant="outline"
              style={{ borderColor: Colors.primary }}
              onPress={handleShowNext}
              isDisabled={isComparing}
            >
              {isComparing && (
                <Spinner
                  size="small"
                  color={Colors.primary}
                  style={{ marginRight: 8 }}
                />
              )}
              <ButtonText style={{ color: Colors.primary }}>
                Show next
              </ButtonText>
            </Button>
          )}
        </>
      )}
    </VStack>
  );
};

export default MarketAlternativeResults;
