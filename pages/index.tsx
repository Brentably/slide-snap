import Image from "next/image"
import { Inter } from "next/font/google"
import { Dispatch, RefObject, SetStateAction, UIEventHandler, useEffect, useMemo, useState } from "react"
import { useRef } from "react"
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion"

const inter = Inter({ subsets: ["latin"] })
const calculateSpaceHeight = (height: number, itemHeight: number): number => {
  const limit = height / itemHeight / 2 - 0.5
  return itemHeight * limit
}

const options = "||||||||||||||||||".split("")

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState(-1)

  const containerWidth = containerRef.current?.clientWidth ?? 384
  const ITEM_WIDTH = 40 // hardcoded because "w-10"
  const ITEM_MARGIN = 12 // harcoded because "mx-3"

  const spacerWidth = useMemo(() => (containerWidth/2) - (ITEM_WIDTH/2) - ITEM_MARGIN, [containerWidth])

  const onScroll: UIEventHandler<HTMLDivElement> = () => {}

  useEffect(() => {
    function scrollEndSnap() {
      console.log('snap')
      const container = containerRef.current
      if(!container) throw new Error()

    }
    containerRef.current?.addEventListener('scrollend', scrollEndSnap)
    return () => containerRef.current?.removeEventListener('scrollend', scrollEndSnap)
  }, [containerRef.current])

  return (
    <div className=" min-h-screen flex items-center justify-center">
      <div className="overflow-scroll relative flex flex-row max-w-sm bg-slate-300 snap-mandatory snap-x scrollbar-hide " onScroll={(e) => {}} ref={containerRef}>
        <div style={{ width: `${spacerWidth}px` }} className={`flex-shrink-0`}></div>
        {options.map((char, i) => (
          <Option key={i} index={i} content={char} setSelected={setSelected} selected={selected} containerRef={containerRef} />
        ))}
        <div style={{ width: `${spacerWidth}px` }} className={`flex-shrink-0`}></div>
      </div>
      <div className="fixed left-1/2 -translate-x-1/2 bg-gray-400 w-[1px] h-20">
          
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
  const containerWidth = containerRef.current?.clientWidth ?? 384
  const ITEM_WIDTH = 40 // hardcoded because "w-10"
  const ITEM_MARGIN = 12 // harcoded because "mx-3"
  const spacerWidth = useMemo(() => (containerWidth / 2) + ITEM_WIDTH + (ITEM_MARGIN/2), [containerWidth])

  const itemRef = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({
    layoutEffect: false,
    container: containerRef,
    target: itemRef,
    axis: "x",
    offset: ['start center', 'end center']
    // offset: ['0 0.5', '-1 0.5']
    // offset: [`0px ${spacerWidth}px`, `52px ${spacerWidth}px`], // blank of the target meets the blank of the container
  })
  const [content1, setContent1] = useState(content)
  // scrollXProgress.on("change", )
  useMotionValueEvent(scrollXProgress, "change", (latest) => {
    // console.log(index, latest.toFixed(2))

    setContent1(latest.toFixed(2))
  })

  useMotionValueEvent(scrollXProgress, 'animationComplete', () => {
    console.log('animation complete')
  })
    const scale = useTransform(scrollXProgress, [1, 0.5, 0], [1, 1.25, 1])

  // const { scrollX } = useScroll({
  //   container: containerRef,
  //   target: itemRef,
  //   axis: "x",
  // })

  return (
    <motion.div
      onClick={() => setSelected(index)}
      className={`flex-shrink-0 flex m-2 mx-3 bg-green-300 h-10 w-10 justify-center items-center rounded-full ${
        selected == index ? "bg-blue-300" : ""
      }`}
      ref={itemRef}
      style={{ scale: scale }}
      >
      {content1}
    </motion.div>
  )
}
