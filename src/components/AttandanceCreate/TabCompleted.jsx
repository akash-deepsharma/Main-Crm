import Link from 'next/link'
import React from 'react'


const TabCompleted = () => {
    return (
        <section className="step-body mt-4 text-center">
            <img src="/images/general/completed-steps.png" alt="Client Created" className="img-fluid wd-300 mb-4" />
            <h4 className="fw-bold">Client Created!</h4>
            <p className="text-muted mt-2">If you need more info, please check how to create Client</p>
            <div className="d-flex justify-content-center gap-1 mt-5">
                <a href="/attendance/create" className="btn btn-light">Create Another Client Attandance</a>
                <Link href="/attendance/list" className="btn btn-primary">Preview Client</Link>
            </div>
        </section>
    )
}

export default TabCompleted