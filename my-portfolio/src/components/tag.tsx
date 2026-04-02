import Chip from '@mui/material/Chip';

type TagProps = {
    label : string
    color : string
}

export default function Tag({label, color} : TagProps){
    return <Chip label={label} variant="outlined" sx={{
        color: color,
        borderColor: color,
      }}/>
}