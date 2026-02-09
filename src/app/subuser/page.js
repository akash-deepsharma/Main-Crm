import Loginsubuser from '@/components/authentication/Loginsubuser'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaBackward } from 'react-icons/fa'

const page = () => {
    return (
        <main className="auth-creative-wrapper">
            <div className="auth-creative-inner">
                <div className="creative-card-wrapper">
                    <div className="card my-4 overflow-hidden" style={{ zIndex: 1 }}>
                        <div className="row flex-1 g-0">
                            <div className="col-lg-6 h-100 my-auto order-1 order-lg-0">
                                <div className="wd-50 bg-white p-2 rounded-circle shadow-lg position-absolute translate-middle top-50 start-50 d-none d-lg-block">
                                    <img src="/images/logo-abbr.png" alt="img" className="img-fluid" />
                                </div>
                                <div className="creative-card-body card-body p-sm-5">
                                    <Loginsubuser registerPath={"/authentication/register"} resetPath={"/authentication/reset"} />
                                </div>
                            </div>
                            <div className="col-lg-6 bg-primary order-0 order-lg-1">
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center">
                                    <Image width={499} height={499} sizes='100vw' src="/images/auth/auth-user.png" alt="img" className="img-fluid" />
                                    <div className='back_home_btn bg-danger '>
                                        <Link href={`https://alphonic-crm.vercel.app`}><FaBackward/>  Go to Website</Link>
                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                                
                </div>
            </div>
        </main>

    )
}
export default page
