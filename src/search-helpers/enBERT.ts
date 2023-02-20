import axios from "axios";

type resultType = { review: string; class: number };

const predictBatch = async (reviews: string[]): Promise<resultType[]> => {
  const apiUrl = "http://localhost:8501/v1/models/my_model15:predict";
  const result: resultType[] = [];
  try {
    const response = await axios.post(
      apiUrl,
      {
        signature_name: "serving_default",
        instances: reviews,
      },
      {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      const predictions: number[] = response.data?.predictions;
      predictions.map((p, idx) => {
        if (p >= 0.5) result.push({ class: 1, review: reviews[idx] });
        else result.push({ class: 0, review: reviews[idx] });
      });
    }
    return result;
  } catch (error: any) {
    console.log("model error", error);
    return [];
  }
};

const enReviewClassification = async (
  reviews: string[]
): Promise<resultType[]> => {
  const stTime = new Date().getTime();
  const result: resultType[] = [];
  const batchSize = 64;
  for (let i = 0; i < reviews.length; i += batchSize) {
    const res = await predictBatch(reviews.slice(i, i + batchSize));
    result.push(...res);
  }

  const elapsed = new Date().getTime() - stTime;
  console.log(
    "engBERT time taken",
    elapsed,
    "to process",
    reviews.length,
    "reviews"
  );

  return result;
};

export default enReviewClassification;
