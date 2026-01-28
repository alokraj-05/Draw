import { useReactFlow, XYPosition } from "@xyflow/react";
import { createContext,Dispatch,SetStateAction,useCallback,useContext,useEffect,useState } from "react";

export type OnDropAction = ({position}:{position: XYPosition}) => void;

interface DnDContextType {
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  dropAction: OnDropAction | null;
  setDropAction: Dispatch<SetStateAction<OnDropAction | null >>;
}

const DnDContext = createContext<DnDContextType | null>(null);

export function DnDProvider({children}:{children:React.ReactNode}){
  const [isDragging,setIsDragging] = useState(false);
  const [dropAction,setDropAction] = useState<OnDropAction | null>(null);

  return (
    <DnDContext.Provider value={{isDragging,setIsDragging,dropAction,setDropAction: (action)=> setDropAction(()=>action)}}>
      {children}
    </DnDContext.Provider>
  )
}

export default DnDContext;

export const useDnD = () => {
  const {screenToFlowPosition} = useReactFlow();

  const context = useContext(DnDContext);
  if(!context){
    throw new Error('useDnD must be used within a DnDProvider');
  }

  const {isDragging,setIsDragging,setDropAction,dropAction} = context;

  const onDragStart = useCallback(
    (event: React.PointerEvent<HTMLDivElement>,onDrop: OnDropAction)=>{
      event.preventDefault();
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
      setIsDragging(true);
      setDropAction(onDrop);
    },
    [setIsDragging,setDropAction]
  )

  const onDragEnd = useCallback(
    (event: PointerEvent)=>{
      if(!isDragging){
        setIsDragging(false)
        return;
      }
      (event.target as HTMLElement).releasePointerCapture(event.pointerId);

      const elementUnderPointer = document.elementFromPoint(event.clientX,event.clientY);
      const isDroppingOnFlow = elementUnderPointer?.closest('.react-flow');
      event.preventDefault();

      if(isDroppingOnFlow){
        const flowPosition = screenToFlowPosition({x: event.clientX, y: event.clientY});
        dropAction?.({position: flowPosition});
      }

      setIsDragging(false);
    }, [screenToFlowPosition,setIsDragging,dropAction]
  )

  useEffect(()=>{
    if(!isDragging) return;
    document.addEventListener('pointerup',onDragEnd);

    return () => {
      document.removeEventListener('pointerup',onDragEnd);
    }
  },[onDragEnd,isDragging])

  return {
    isDragging,
    onDragStart
  }
}

export const useDnDPosition = () =>{
  const [position,setPosition] = useState<XYPosition | undefined>(undefined);
  const onDrag = useCallback((event:PointerEvent)=>{
    event.preventDefault();
    setPosition({x: event.clientX, y: event.clientY})
  },[])

  useEffect(()=>{
    document.addEventListener('pointermove',onDrag);
    return () =>{
      document.removeEventListener('pointermove',onDrag)
    }
  },[onDrag])
  return {position}
}