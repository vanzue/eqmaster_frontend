export const IMGURL="https://eqmaster.blob.core.chinacloudapi.cn";
export const TOKEN="?sp=r&st=2024-11-18T09:41:26Z&se=2025-11-18T17:41:26Z&sv=2022-11-02&sr=c&sig=WL07d2l6cOkDXNTjNxkTEU3Yl0J%2FrNlWU%2FUPGJRPfhA%3D";
export function getImg(picnName){
	//console.log(IMGURL+picnName+TOKEN);
	return IMGURL+picnName+TOKEN;
}