import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/appcomponents/ui/sidebar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectItem,
} from "@/appcomponents/ui/select";
import { getFiles, getSpecificFile, saveFile } from "@/api/files";
import { useEffect, useState } from "react";
import { FaFile, FaFileCirclePlus } from "react-icons/fa6";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/appcomponents/ui/popover";
import { Button } from "@/appcomponents/ui/button";
import { Label } from "@/appcomponents/ui/label";
import { Input } from "@/appcomponents/ui/input";
import { Spinner } from "@/appcomponents/ui/spinner";
import { useDispatch } from "react-redux";
import { setSelectedFile, setIsLoading, FileMode } from "./dashboardSlice";
import { AppDispatch } from "@/app/store";
import { MdModeEditOutline } from "react-icons/md";
import { getProfile } from "@/api/user";
interface FileRes {
  title: string;
  id: string;
}

interface UserRes {
  user:{
    displayName: string,
    photoLink: string,
    emailAddress:string,
  }
}
const savefile = async (filename: string,type:string) => {
  const res = await saveFile(filename,type);
  return res;
};

export const AppSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [fileName, setFileName] = useState("");
  const [files, setFiles] = useState<FileRes[]>([]);
  const [selectedType,setSelectedType] = useState<FileMode>('flow')
  const [userProfile,setUserProfile] = useState<UserRes>()
  const [isProfileLoading,setIsProfileLoading] = useState(false);
  useEffect(() => {
    setIsLoadingFiles(true);
    const fetchFiles = async () => {
      const res = (await getFiles()) as FileRes[];
      if (!res) setFiles([{ title: "", id: "" }]);
      else setFiles(res);
      setIsLoadingFiles(false);
    };

    fetchFiles();
  }, []);
  useEffect(()=>{
    setIsProfileLoading(true);
    const fetchProfile = async () =>{
      const profile = await getProfile() as UserRes;
      if(!profile) setUserProfile({user:{displayName: "",photoLink:"",emailAddress:""}});
      else setUserProfile(profile)
      setIsProfileLoading(false)
    }

    fetchProfile()
  },[])
  const handleFileClick = async (fileId: string, fileTitle: string) => {
    dispatch(setIsLoading(true));
    try {
      const fileData = await getSpecificFile(fileId);
      const fileType: FileMode = (fileData?.type as FileMode) || "flow";

      let data: any;
      if (fileType === "flow") {
        const nodes = fileData.nodes || [];
        const edges = fileData.edges || [];
        data = { nodes, edges };
      } else if (fileType === "canvas") {
        const elements = fileData.elements || fileData.element || [];
        const version = fileData.version !== undefined ? String(fileData.version) : "1";
        const appState =
          fileData.appState ||
          ({
            zoom: 1,
            offsetX: 0,
            offsetY: 0,
            selectedTool: "select",
            strokeColor: "#000000",
            fillColor: "#ffffff",
            strokeWidth: 1,
            selectedElementId: null,
          } as any);

        data = { version, appState, elements };
      } else {
        // database or unknown: pass through raw file data
        data = fileData;
      }

      dispatch(
        setSelectedFile({
          id: fileId,
          title: fileTitle,
          mode: fileType,
          data,
        }),
      );
    } catch (error) {
      console.error("Error loading file:", error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };
  return (
    <Sidebar className="p-regular">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center">
            <p>Files</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"ghost"} className="text-sm">
                  <FaFileCirclePlus className="" />{" "}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="leading-none font-medium">New file</h4>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="width">
                        <FaFile />
                        Name
                      </Label>
                      <Input
                        id="width"
                        defaultValue="new file"
                        className="col-span-2 h-8"
                        onChange={(e) => setFileName(e.target.value)}
                      />
                      <Label htmlFor="width">
                        <MdModeEditOutline />
                        Type
                      </Label>
                      <Select defaultValue="flow" onValueChange={(val: FileMode)=>setSelectedType(val)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="database">Database</SelectItem>
                            <SelectItem value="canvas">Canvas</SelectItem>
                            <SelectItem value="flow">Flow</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      className={`${fileName.length < 1 ? "disabled:cursor-not-allowed bg-gray-400 hover:cursor-not-allowed focus:bg-gray-400 focus-within:bg-gray-400 hover:bg-gray-400" : "cursor-pointer"}`}
                      onClick={() => savefile(fileName,selectedType)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarGroupLabel>
          {isLoadingFiles ? (
            <div className="">
              <Spinner />
            </div>
          ) : (
            <SidebarGroupContent>
              {files.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => handleFileClick(item.id, item.title)}
                      className="active:bg-accent focus:bg-accent"
                    >
                      <FaFile style={{ width: 12, height: 12 }} />
                      {item.title.replace(".draw.json", "")}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {isProfileLoading ? (
          <div className="">
            <Spinner/>
          </div>
        ):(
          <SidebarMenu className="bg-accent rounded-md "> 
            <SidebarMenuItem className="grid grid-cols-[10%_90%] items-center gap-2 p-2">
              <img src={`${userProfile?.user.photoLink}`} alt="user image" className="w-7 rounded-full"/>
              <div className="">
                <p className="flex items-center gap-2 text-sm">{userProfile?.user.displayName}</p>
                <p className="flex items-center text-xs text-gray-400">{userProfile?.user.emailAddress}</p>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};
