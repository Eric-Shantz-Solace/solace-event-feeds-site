import { TryItRows, TryItColumns } from "./TryItTableData.js";

export const CreateSubscribedTopicString = (generatedData) => {
    const selectedItems = [];
    const STORAGE_KEY = 'TryItData';
    let parsedData;

        // User Input Table
        if (generatedData && Object.keys(generatedData).length !== 0) {
            parsedData = generatedData;
        } else {
            const savedData = localStorage.getItem(STORAGE_KEY);
            try {
                parsedData = savedData ? JSON.parse(savedData) : { columns: TryItColumns, rows: TryItRows };
            } catch (e) {
                console.error("Error parsing saved data from localStorage", e);
                parsedData = { columns: TryItColumns, rows: TryItRows };
            }
        }
    
        const { columns: datasetColumns, rows: datasetRows } = parsedData;        

        // Remove everything after the > wildcard
        for (const column of datasetColumns) {
            const columnKey = column.field;
            const availableItems = datasetRows
                .map(row => row[columnKey])
                .filter(item => item !== undefined && item !== "");

            if (availableItems.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableItems.length);
                const selectedItem = availableItems[randomIndex];

                if (selectedItem === ">") {
                    selectedItems.push(selectedItem);
                    break;
                }

                selectedItems.push(selectedItem);
            }
        }
        
        return selectedItems.join(' / ');
};

export default CreateSubscribedTopicString;