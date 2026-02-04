import React from "react";
import CustomBulkUpload from "../CustomComponents/CustomBulkUpload";
import {
  columnOrder as publicationsColumnOrder,
  sampleHeaders as publicationsSampleHeaders,
  duplicateCheck as publicationsDuplicateCheck,
  validateRow as publicationsValidateRow,
} from "../../utils/bulkUpload/publicationsConfig";

export const BulkUpload = ({ titles }) => {
  const columnOrder = publicationsColumnOrder;

  const sampleHeaders = publicationsSampleHeaders;

  const duplicateCheck = publicationsDuplicateCheck;

  const validateRow = publicationsValidateRow;

  return (
    <CustomBulkUpload
      titles={titles}
      endpoint={"api/publications/bulk"}
      columnOrder={columnOrder}
      sampleHeaders={sampleHeaders}
      duplicateCheck={duplicateCheck}
      validateRow={validateRow}
      sampleFilename={"Sample_Publications_Upload_File.csv"}
      triggerText={"Bulk Upload"}
    />
  );
};
