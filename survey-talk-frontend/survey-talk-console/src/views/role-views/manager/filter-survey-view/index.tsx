import { createContext, type FC, useEffect, useMemo, useState } from "react"
import "./styles.scss"
import { AgGridReact } from "ag-grid-react"
import { CButton, CButtonGroup, CCard, CCol, CRow, CSpinner } from "@coreui/react"
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community"
import CustomerUpdate from "../../admin/customer-view/CustomerUpdate"
import { Eye } from "phosphor-react"
import Modal_Button from "../../../components/common/modal/ModalButton"
import { useNavigate } from "react-router-dom"
import { FilterSurvey } from "../../../../core/types"
import { managerAxiosInstance } from "../../../../core/api/rest-api/config/instances/v2/manager-axios-instance"
import SurveyTalkLoading from "../../../components/common/loading"
import { formatDate } from "../../../../core/utils/date.util"
import { getFilterSurveys } from "../../../../core/services/survey/survey-core/survey-core.service"

ModuleRegistry.registerModules([AllCommunityModule])


interface FilterSurveyViewProps { }
interface FilterSurveyViewContextProps {
    handleDataChange: () => void
}
interface GridState {
    columnDefs: ColDef[]
    rowData: FilterSurvey[]
}

export const FilterSurveyViewContext = createContext<FilterSurveyViewContextProps | null>(null)
const getSurveyStatusText = (statusId: number): string => {
    const statusMap: { [key: number]: string } = {
        1: "Editing",
        2: "Published",
        3: "Completed",
        4: "Deleted",
        5: "Deactivated",
    }
    return statusMap[statusId] || "Unknown"
}
const state_creator = (surveys: FilterSurvey[], navigate: (path: string) => void) => {
    const state = {
        columnDefs: [
            { headerName: "ID", field: "Id", flex: 0.4 },
            { headerName: "Title", field: "Title", flex: 1.5 },
            { headerName: "XP Reward", field: "SurveyPrivateData.MaxXp", flex: 0.6 },
            {
                headerName: "Question Count",
                field: "QuestionCount",
                flex: 0.8,
                valueFormatter: (params: any) => (params.value ? `${params.value} câu` : "0 câu"),
            },
            {
                headerName: "Base Reward Price",
                field: "TakerBaseRewardPrice",
                flex: 0.8,
                valueFormatter: (params: any) => (params.value ? `${params.value.toLocaleString()} VND` : "0 VND"),
            },
            {
                headerName: "Status",
                cellClass: "d-flex align-items-center",
                valueGetter: "SurveyStatusId",
                cellRenderer: (params: any) => {
                    const statusText = getSurveyStatusText(params.data.SurveyStatusId)
                    return <span>{statusText}</span>
                },
                flex: 0.8,
            },
            {
                headerName: "Publish Date",
                field: "PublishedAt",
                flex: 1,
                valueGetter: (params: { data: FilterSurvey }) => formatDate(params.data.PublishedAt || 'Chưa publish'),
            },
            {
                cellClass: "d-flex justify-content-center py-0",
                cellRenderer: (params: any) => {
                    const surveyId = params.data.Id;
                    return (
                        <CButton variant="ghost" size="sm" className="survey-card__action-btn mt-n2 text-primary"
                            onClick={() => {
                                navigate('/filter-survey/detail/' + surveyId);
                            }}>
                            <Eye size={30} />
                        </CButton>
                    )
                },
                flex: 0.5,
            },
        ],
        rowData: surveys,
    }
    return state
}

const FilterSurveyView: FC<FilterSurveyViewProps> = () => {
    const [state, setState] = useState<GridState | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const handleDataChange = async () => {
        setIsLoading(true);
        const surveyList = await getFilterSurveys(managerAxiosInstance);
        if (surveyList.success) {
            setState(state_creator(surveyList.data.Surveys, navigate));
        } else {
            console.error('API Error:', surveyList.message);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        handleDataChange()
    }, [])

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            filter: true,
            autoHeight: true,
            resizable: true,
            wrapText: true,
            cellClass: "d-flex align-items-center",
            editable: false,
        }
    }, [])

    return (
        <FilterSurveyViewContext.Provider value={{ handleDataChange: handleDataChange }}>
            {isLoading ? (
                <SurveyTalkLoading />
            ) : (
                <CRow>
                    <div className="filter-survey__header mb-4 mt-4">
                        <h3 className="filter-survey__header-title mb-5">Danh Sách Khảo Sát Đầu Vào</h3>
                        <CButton className="filter-survey__header-button mt-5" href="#">
                            Tạo Mới
                        </CButton>
                    </div>
                    <CCol xs={12}>
                        <div className="filter-survey__table">
                            <AgGridReact
                                columnDefs={state?.columnDefs}
                                rowData={state?.rowData}
                                defaultColDef={defaultColDef}
                                rowHeight={70}
                                headerHeight={40}
                                pagination={true}
                                paginationPageSize={10}
                                paginationPageSizeSelector={[10, 20, 50, 100]}
                                domLayout="autoHeight"
                            />
                        </div>
                    </CCol>
                </CRow>
            )}
        </FilterSurveyViewContext.Provider>
    )
}

export default FilterSurveyView
