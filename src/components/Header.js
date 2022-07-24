import { useState, useEffect } from "react";
const Block = (props) => {
  const [dateState, setDateState] = useState(new Date());

  useEffect(() => {
    setInterval(() => setDateState(new Date()), 1000);
  }, []);

  return (
    <div className="w-full bg-picton p-3   items-center grid-cols-12 grid">
      <div className="text-white  font-bold text-2xl col-span-2 px-2">
        <h1 className="">Hydrazine</h1>
      </div>
      <div className="text-foam-300 flex space-x-8 justify-center font-medium col-span-8 px-2 uppercase">
        <h2>Github</h2>
        <h2>Discord</h2>
      </div>
      <div className="text-white flex items-center justify-center text-center font-medium col-span-2 px-2">
        <h1>
          {/* {dateState.toLocaleString("en-US", {
            second: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })} */}
          v0.0.1 - Source Code
        </h1>
      </div>
    </div>
  );
};

export default Block;