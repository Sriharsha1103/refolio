import React from "react";
import CustomBulkUpload from "../CustomComponents/CustomBulkUpload";
import {
  columnOrder as patentsColumnOrder,
  sampleHeaders as patentsSampleHeaders,
  duplicateCheck as patentsDuplicateCheck,
  preprocessRow as patentsPreprocessRow,
  validateRow as patentsValidateRow,
} from "../../utils/bulkUpload/patentsConfig";

export const BulkUpload = ({ titles }) => {
  const columnOrder = patentsColumnOrder;

  const sampleHeaders = patentsSampleHeaders;

  const duplicateCheck = patentsDuplicateCheck;

  const preprocessRow = patentsPreprocessRow;

  const validateRow = patentsValidateRow;

  return (
    <CustomBulkUpload
      titles={titles}
      endpoint={"api/patents/bulk"}
      columnOrder={columnOrder}
      sampleHeaders={sampleHeaders}
      duplicateCheck={duplicateCheck}
      preprocessRow={preprocessRow}
      validateRow={validateRow}
      sampleFilename={"Sample_PatentsKeys_Upload_File.csv"}
      triggerText={"Bulk Upload"}
    />
  );
};
