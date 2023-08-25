import Image from "next/image"
import { Inter } from "next/font/google"
import { Dispatch, RefObject, SetStateAction, UIEventHandler, useEffect, useMemo, useState } from "react"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const inter = Inter({ subsets: ["latin"] })
const calculateSpaceHeight = (height: number, itemHeight: number): number => {
  const limit = height / itemHeight / 2 - 0.5
  return itemHeight * limit
}

const options = "123456789".split("")

export default function Home() {
  const ref = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState(-1)

  const containerWidth = ref.current?.clientWidth ?? 384
  const ITEM_WIDTH = 40 // hardcoded because "w-10"
  const ITEM_MARGIN = 12 // harcoded because "mx-3"

  const spacerWidth = useMemo(() => (containerWidth/2) - (ITEM_WIDTH/2) - ITEM_MARGIN, [containerWidth])

  const onScroll: UIEventHandler<HTMLDivElement> = () => {}

  return (
    <div className=" min-h-screen flex items-center justify-center w-[120vw]">
      <div className="overflow-scroll flex max-w-sm bg-slate-300 snap-mandatory snap-x scroll-smooth scrollbar-hide" onScroll={(e) => {}} ref={ref}>
        <div style={{ width: `${spacerWidth}px` }} className={`flex-shrink-0`}></div>
        {options.map((char, i) => (
          <Option key={i} index={i} content={char} setSelected={setSelected} selected={selected} containerRef={ref} />
        ))}
        <div style={{ width: `${spacerWidth}px` }} className={`flex-shrink-0`}></div>
      </div>
    </div>
  )
}

// widthOfMovingBlock = (numItems * itemWidth + (numItems + 1) * marginXWidth)

// lets calculate offset
// it's just half the width of the container minus half of an item. were trying to figure out how much spacing to center the edge items.
//

export function Option({
  index,
  content,
  setSelected,
  selected,
  containerRef,
}: {
  index: number
  content: string
  setSelected: Dispatch<SetStateAction<number>>
  selected: number
  containerRef: RefObject<HTMLDivElement>
}) {
  const itemRef = useRef<HTMLButtonElement>(null)
    const { scrollXProgress } = useScroll({
      container: containerRef,
      target: itemRef,
      axis: "x",
      offset: ["start center", "end center"], // blank of the target meets the blank of the container
    })


  

    // const { scrollX } = useScroll({
    //   container: containerRef,
    //   target: itemRef,
    //   axis: "x",
    // })

  return (
    
    <motion.button
      onClick={() => setSelected(index)}
      className={`flex-shrink-0 m-2 mx-3 bg-green-300 h-10 w-10 flex justify-center items-center rounded-full ${
        selected == index ? "bg-blue-300" : ""
      }`}
      ref={itemRef}
      style={{ scale: scrollXProgress}}>
      
      {content}
    </motion.button>
  )
}
