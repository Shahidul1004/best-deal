import { resultType } from "@/types";
import axios from "axios";

const predictBatch = async (
  reviews: { original: string; cleaned: string }[]
): Promise<resultType[]> => {
  const apiUrl = "http://localhost:8601/v1/models/bnBERT:predict";
  const result: resultType[] = [];
  try {
    const response = await axios.post(
      apiUrl,
      {
        signature_name: "serving_default",
        instances: reviews.map((e) => e.cleaned),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      const predictions: number[] = response.data?.predictions;
      predictions.map((p, idx) => {
        if (p >= 0.5)
          result.push({ class: 1, review: reviews[idx].original, type: "bn" });
        else
          result.push({ class: 0, review: reviews[idx].original, type: "bn" });
      });
    }
    return result;
  } catch (error: any) {
    console.log("model error", error);
    return [];
  }
};

const bnReviewClassification = async (
  reviews: { original: string; cleaned: string }[]
): Promise<resultType[]> => {
  const stTime = new Date().getTime();
  const result: resultType[] = [];
  const batchSize = 32;
  for (let i = 0; i < reviews.length; i += batchSize) {
    const res = await predictBatch(reviews.slice(i, i + batchSize));
    result.push(...res);
  }

  const elapsed = new Date().getTime() - stTime;
  console.log(
    "bnBERT time taken",
    elapsed,
    "to process",
    reviews.length,
    "reviews"
  );

  return result;
};

export default bnReviewClassification;
