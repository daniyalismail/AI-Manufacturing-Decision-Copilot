import { ContentCard } from "@/components/ui/ContentCard";

export default function Page() {
  return (
    <div className="flex flex-col pt-12">
      <h1 className="text-[53px] font-medium text-ink-black tracking-[-2.12px] leading-[1.15] mb-[60px]">
        Project Dashboard
      </h1>
      <ContentCard>
        <p className="text-[18px] text-stone-gray">This is the Project Dashboard page.</p>
      </ContentCard>
    </div>
  );
}
