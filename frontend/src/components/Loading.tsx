import { PacmanLoader } from 'react-spinners';

export default function Loading() {
  return (
    <>
      <div className="loading">
        <h1>Loading...</h1>
        <PacmanLoader
          color="#003366"
          cssOverride={{
            marginRight: 120
          }}
          margin={2}
          size={65}
          speedMultiplier={1}
        />
      </div>
    </>
  )
}