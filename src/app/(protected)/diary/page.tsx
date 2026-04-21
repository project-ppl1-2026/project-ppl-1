import { redirect } from "next/navigation";

export default function DiaryIndexPage() {
  redirect("/diary/today");
}
