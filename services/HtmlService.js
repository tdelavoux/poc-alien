export class HtmlService{
    static stringToHtmlElement(string){
        const element = document.createElement('div');
        element.innerHTML = string;
        return element.firstChild;
    }
}