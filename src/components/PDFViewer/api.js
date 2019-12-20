import Axios from 'axios';
export function getContractFile(contract) {
    return new Promise((resolve, reject) => {
        Axios(`${CONSTANTS.ENDPOINT.CONTRACT}/${contract._id}`, {
            responseType: "blob",
            method: "get",
        })
            .then(async res => {
                if (res.data.type === "application/json") {
                    const text = await res.data.text();
                    console.log("response file:", text);
                    const json = JSON.parse(text);
                    // this.setState({ MessageOpen: true, MessageText: json.message, MessageType: "warning" });
                    return reject(json);
                }
                const blob = new Blob([res.data], {
                    type: "application/pdf"
                });
                const file = new File([blob], "contract.pdf", { type: blob.type });
                console.log("file", file);
                resolve(file);
            })
    })
}
export function addNewContract(contract) {

}
export function addNewPartner(contract) {

}