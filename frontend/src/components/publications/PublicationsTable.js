import React, { useEffect, useMemo } from 'react';
import { Tooltip, Zoom, Typography } from "@mui/material";
import { IconTrash } from "@tabler/icons-react";
import HelpModal from "./HelpModal";
import { PatentsKey, Publication, ResearchKey, UsersKey } from "../../Service/keyValueMap";
import CustomTable from "../CustomTable";
import PublicationsFilters from "./PublicationsFilters";
import { use } from 'react';
import { fontWeight } from '@mui/system';

const fun = (e) => {
    if (!e) return "";
    var isod = new Date(e).toLocaleDateString().split("/");
    return isod[2];
};

// helper to replicate the coloring logic - moved outside to prevent re-creation
const CustomCell = ({ row, value, bg, children, stickyLeft, color, background, textColor }) => {
    const style = {
        color: row?.my ? color : textColor,
        background: row?.my ? background : bg,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '8px',
        position: stickyLeft !== undefined ? 'sticky' : undefined,
        left: stickyLeft,
        zIndex: stickyLeft !== undefined ? 10 : undefined,
    };
    return <div style={style}>{children || value}</div>;
};

const PublicationsTable = ({
    data,
    pageNo,
    perPage,
    filters,
    handleFilterChange,
    handleSelectFilterChange,
    handleDelete,
    isAdmin,
    isSuperAdmin,
    color,
    background,
    textColor,
    jobs,
    authorsList,
    fieldConfigs, type
}) => {

    const bgColors = ["#A6BE87", "#C3D496", "#F0F7E6"];
    const [tableType, setTableType] = React.useState('');
    useEffect(()=>{
        if(type === 'Publication'){
            setTableType(Publication);
        }
        else if(type === 'User'){
            setTableType(UsersKey);
        }
        else if(type === 'PatentsKey'){
            setTableType(PatentsKey);;
        }
        else if(type === 'ResearchKey'){
            setTableType(ResearchKey);
        }
    },[type]);
    
    const columns = useMemo(() => {
        const generatedColumns = fieldConfigs.map((config, index) => {
            const bg = bgColors[index % bgColors.length];
            const cellProps = { bg, stickyLeft: config.stickyLeft, color, background, textColor };
            
            let renderCell = (params) => <CustomCell row={params.row} value={params.value} {...cellProps} />;
            let valueGetter = undefined;

            if (config.isDate) {
                renderCell = (params) => (
                    <CustomCell row={params.row} {...cellProps}>
                        <span>{fun(params.value)}</span>
                    </CustomCell>
                );
            } else if (config.isLink) {
                renderCell = (params) => (
                    <CustomCell row={params.row} {...cellProps}>
                        <a href={params.value} target="_blank" rel="noreferrer" style={{color: 'inherit'}}>{params.value}</a>
                    </CustomCell>
                );
            } else if (config.isPageRange) {
                valueGetter = (params) => (params.row.starting_page || '') + "-" + (params.row.ending_page || '');
                renderCell = (params) => (
                    <CustomCell row={params.row} {...cellProps}>
                        {params.value}
                    </CustomCell>
                );
            }

            return {
                field: config.field,
                headerName: tableType[config.field],
                width: config.width,
                valueGetter,
                renderCell,
                fixed: config.stickyLeft !== undefined,
                filterable: true,
                fontWeight: 'bold',
            };
        });

        return [
            {
                field: "index",
                headerName: "No.",
                width: 60,
                fixed: true,
                fontWeight: 'bold',
                renderCell: (params) => {
                    // Approximate index calculation based on available props
                    const index = params.api.getAllRowIds().indexOf(params.id);
                    return <div style={{
                        background: "#548C42", 
                        color: 'white', 
                        width: '100%', 
                        height:'100%', 
                        display:'flex', 
                        alignItems:'center', 
                        paddingLeft:8,
                        position: 'sticky',
                        left: 0,
                        zIndex: 10,
                    }}>
                        {(index + 1) + ((pageNo || 1) - 1) * (perPage || 100)}
                    </div>
                }
            },
            ...generatedColumns,
            {
                field: "actions",
                headerName: "Edit / Delete",
                width: 100,
                sortable: false,
                fontWeight: 'bold',
                renderCell: (params) => {
                    if (!isAdmin && !isSuperAdmin) return null;
                    return (
                        <div style={{background: "#8CAB3D", width: '100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <HelpModal edit={params.row} />
                            <Tooltip arrow title="Delete" placement="top" TransitionComponent={Zoom}>
                                <IconTrash
                                    color="white"
                                    style={{cursor:'pointer', marginLeft: 8}}
                                    size={23}
                                    onClick={() => handleDelete(params.row)}
                                />
                            </Tooltip>
                        </div>
                    );
                }
            }
        ];
    }, [color, background, textColor, pageNo, perPage, isAdmin, isSuperAdmin, handleDelete]);

    return (
        <React.Fragment>
            {/* <PublicationsFilters
                filters={filters}
                handleFilterChange={handleFilterChange}
                handleSelectFilterChange={handleSelectFilterChange}
                jobs={jobs}
                authorsList={authorsList}
            /> */}
            <CustomTable
                data={data}
                columns={columns}
                pageSize={data.length}
            />
        </React.Fragment>
    );
};

export default PublicationsTable;
