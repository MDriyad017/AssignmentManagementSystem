export const getDisplayFileName = (fileUrl: string): string => {
    if (!fileUrl) return 'View File';
    
    const fileName = fileUrl.split('/').pop() || fileUrl;
    
    const displayName = fileName.includes('_') 
        ? fileName.substring(fileName.indexOf('_') + 1) 
        : fileName;
    
    return displayName;
};