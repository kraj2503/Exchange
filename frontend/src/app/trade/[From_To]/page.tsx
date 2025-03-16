"use client";
import { useParams } from "next/navigation";
import useRedirect from "../../../../hooks/useRedirect";
import Ticker from "@/components/Ticker";

export default function Page() {
  const params = useParams<{ From_To: string }>();
  console.log(params.From_To);
  useRedirect();

  return (
    <>
    <div className="bg-slate-950 h-screen text-white grid grid-cols-6" >

    <div className="col-span-4 my-5 mx-3 ">
      <Ticker Ticker={'1809'} FromTo={params.From_To} change={{ number: 5.23, percentage: 2.5 }} 
      
      high= {'1995.65'}
      low = {'1867.45'}
      volume = {'224244.66'}
      
      />
    </div>
    <div className="">
        This is place order
    </div>
    </div>
    
    </>
  );
}
