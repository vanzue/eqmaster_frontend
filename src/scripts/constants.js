export const IMGURL="https://eqmaster.blob.core.windows.net";
export const TOKEN="?sp=r&st=2024-10-30T07:28:21Z&se=2025-10-30T15:28:21Z&sv=2022-11-02&sr=c&sig=U3yHYWEQBvY3MnZO6kUh%2Fc0LiaLuvuPFp1YB4nnAL8E%3D";
export function getImg(picnName){
	//console.log(IMGURL+picnName+TOKEN);
	return IMGURL+picnName+TOKEN;
}