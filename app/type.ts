 export type messagesStr={
    role:string 
    content:string
  }
export type audioMsg={
  msg:messagesStr,
  audio:string
}
  export  type bodyImportant={
    msgs:messagesStr[]
    model:string 

  }